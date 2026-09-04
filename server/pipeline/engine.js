/**
 * pipeline/engine.js — Disease escalation engine
 *
 * runPipeline(db, reportId)
 *   1. Loads the new report.
 *   2. Same syndrome+species+village within 7 days → 2+ reports → create/update Case, tag report.
 *   3. Same Case: reports across 2+ distinct villages within 14 days and 3+ total → create Cluster.
 *   4. Cluster: 5+ reports AND mortality > 0 → create SUSPECTED outbreak (NEVER auto-CONFIRMED).
 *   5. Returns { escalated, newStatus }
 */

'use strict';

function runPipeline(db, reportId) {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
  if (!report) {
    console.warn(`[pipeline] Report ${reportId} not found.`);
    return { escalated: false, newStatus: 'REPORT' };
  }

  let escalated = false;
  let newStatus = report.status || 'REPORT';

  // ── Step 1: Village-level case detection ────────────────────────────────────
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

  const villageReports = db.prepare(`
    SELECT id, case_id, mortality_count
    FROM reports
    WHERE syndrome    = ?
      AND species     = ?
      AND village     = ?
      AND captured_at >= ?
  `).all(report.syndrome, report.species, report.village, sevenDaysAgoStr);

  if (villageReports.length >= 2) {
    // Check if a Case already exists for this syndrome+species+village window
    let caseRecord = db.prepare(`
      SELECT * FROM cases
      WHERE syndrome = ? AND species = ? AND village = ?
        AND started_at >= ?
    `).get(report.syndrome, report.species, report.village, sevenDaysAgoStr);

    if (!caseRecord) {
      // Create new case
      const insert = db.prepare(`
        INSERT INTO cases (syndrome, species, district, village, started_at, status, severity, report_count)
        VALUES (?, ?, ?, ?, datetime('now'), 'CASE', 'MEDIUM', ?)
      `);
      const result = insert.run(
        report.syndrome, report.species,
        report.district, report.village,
        villageReports.length
      );
      caseRecord = db.prepare('SELECT * FROM cases WHERE id = ?').get(result.lastInsertRowid);
      console.log(`[pipeline] New Case created: id=${caseRecord.id}`);
    } else {
      // Update report_count
      db.prepare(`UPDATE cases SET report_count = ? WHERE id = ?`)
        .run(villageReports.length, caseRecord.id);
    }

    const caseId = caseRecord.id;

    // Tag all village reports with this case_id and status=CASE
    db.prepare(`
      UPDATE reports SET case_id = ?, status = 'CASE'
      WHERE syndrome = ? AND species = ? AND village = ? AND captured_at >= ?
    `).run(caseId, report.syndrome, report.species, report.village, sevenDaysAgoStr);

    escalated = true;
    newStatus = 'CASE';

    // ── Step 2: Multi-village cluster detection ──────────────────────────────
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

    const caseReports = db.prepare(`
      SELECT id, village, mortality_count
      FROM reports
      WHERE case_id = ? AND captured_at >= ?
    `).all(caseId, fourteenDaysAgoStr);

    const distinctVillages = new Set(caseReports.map(r => r.village));

    if (caseReports.length >= 3 && distinctVillages.size >= 2) {
      // Check if cluster already exists for this case
      let clusterRecord = db.prepare(
        'SELECT * FROM clusters WHERE case_id = ?'
      ).get(caseId);

      if (!clusterRecord) {
        // Calculate rough centroid
        const lats = db.prepare(`
          SELECT latitude FROM reports WHERE case_id = ? AND latitude IS NOT NULL
        `).all(caseId).map(r => r.latitude);
        const lngs = db.prepare(`
          SELECT longitude FROM reports WHERE case_id = ? AND longitude IS NOT NULL
        `).all(caseId).map(r => r.longitude);

        const centerLat = lats.length ? lats.reduce((a, b) => a + b, 0) / lats.length : null;
        const centerLng = lngs.length ? lngs.reduce((a, b) => a + b, 0) / lngs.length : null;

        const clusterInsert = db.prepare(`
          INSERT INTO clusters (case_id, label, center_lat, center_lng, radius_km, report_count, status)
          VALUES (?, ?, ?, ?, 10, ?, 'CLUSTER')
        `);
        const clusterResult = clusterInsert.run(
          caseId,
          `${report.syndrome} ${report.district || 'District'} Cluster`,
          centerLat, centerLng,
          caseReports.length
        );
        clusterRecord = db.prepare('SELECT * FROM clusters WHERE id = ?')
          .get(clusterResult.lastInsertRowid);

        // Update case status
        db.prepare(`UPDATE cases SET status = 'CLUSTER' WHERE id = ?`).run(caseId);

        // Tag all case reports as CLUSTER
        db.prepare(`UPDATE reports SET status = 'CLUSTER' WHERE case_id = ?`).run(caseId);

        escalated = true;
        newStatus = 'CLUSTER';
        console.log(`[pipeline] New Cluster created: id=${clusterRecord.id} for case=${caseId}`);
      } else {
        // Update cluster report count
        db.prepare(`UPDATE clusters SET report_count = ? WHERE id = ?`)
          .run(caseReports.length, clusterRecord.id);
      }

      const clusterId = clusterRecord.id;

      // ── Step 3: Suspected outbreak detection ──────────────────────────────
      const totalMortality = caseReports.reduce((sum, r) => sum + (r.mortality_count || 0), 0);
      const clusterReportCount = db.prepare(
        'SELECT report_count FROM clusters WHERE id = ?'
      ).get(clusterId).report_count;

      if (clusterReportCount >= 5 && totalMortality > 0) {
        const existingOutbreak = db.prepare(
          'SELECT id FROM suspected_outbreaks WHERE cluster_id = ?'
        ).get(clusterId);

        if (!existingOutbreak) {
          db.prepare(`
            INSERT INTO suspected_outbreaks (cluster_id, status, notes)
            VALUES (?, 'SUSPECTED', ?)
          `).run(
            clusterId,
            `Auto-detected: ${clusterReportCount} reports, ${totalMortality} mortality across ${distinctVillages.size} villages.`
          );
          escalated = true;
          newStatus = 'SUSPECTED';
          console.log(`[pipeline] Suspected outbreak created for cluster=${clusterId}`);
        }
      }
    }
  }

  // Refresh the report's final status
  const updatedReport = db.prepare('SELECT status FROM reports WHERE id = ?').get(reportId);
  if (updatedReport) newStatus = updatedReport.status;

  return { escalated, newStatus };
}

module.exports = { runPipeline };
