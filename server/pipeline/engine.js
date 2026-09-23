/**
 * pipeline/engine.js — Disease escalation engine with Sentinel Signal Score
 */
'use strict';

function calculateOutbreakDNA(reports, isCluster, totalMortality) {
  let clinical = 50, spatial = 30, temporal = 40, preventive = 50, historical = 50, mortality = 0, weather = 60;
  
  if (reports.length >= 5) temporal = 90;
  else if (reports.length >= 2) temporal = 75;
  
  const unvaxCount = reports.filter(r => r.vaccination_status === 'unvaccinated' || r.vaccination_status === 'no').length;
  if (reports.length > 0 && unvaxCount / reports.length > 0.4) preventive = 85;
  
  if (isCluster) spatial = 88;
  else if (reports.length >= 2) spatial = 60;
  
  const allSymptoms = reports.map(r => r.symptoms || '').join(' ').toLowerCase();
  if (allSymptoms.includes('blister') || allSymptoms.includes('salivation') || allSymptoms.includes('sudden death')) clinical = 92;
  
  if (totalMortality > 0) mortality = 95;
  
  const score = Math.round((clinical*1.5 + spatial*1.2 + temporal*1.2 + preventive + historical + mortality*1.5 + weather*0.5) / 7.9);
  
  return {
    score: Math.min(100, Math.max(0, score)),
    dna: { clinical, spatial, temporal, preventive, movement: 50, historical, mortality, weather }
  };
}

function getSLA(score) {
  const now = new Date();
  if (score >= 85) now.setHours(now.getHours() + 24); // CRITICAL
  else if (score >= 70) now.setHours(now.getHours() + 48); // HIGH
  else now.setHours(now.getHours() + 72); // MODERATE
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function runPipeline(db, reportId) {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
  if (!report) return { escalated: false, newStatus: 'REPORT' };

  let escalated = false;
  let newStatus = report.status || 'REPORT';

  // 1. Village-level case detection (7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

  const villageReports = db.prepare(`SELECT * FROM reports WHERE syndrome = ? AND species = ? AND village = ? AND captured_at >= ?`).all(report.syndrome, report.species, report.village, sevenDaysAgoStr);

  if (villageReports.length >= 2) {
    let caseRecord = db.prepare(`SELECT * FROM cases WHERE syndrome = ? AND species = ? AND village = ? AND started_at >= ?`).get(report.syndrome, report.species, report.village, sevenDaysAgoStr);
    
    let totalMort = villageReports.reduce((sum, r) => sum + (r.mortality_count || 0), 0);
    const sentinel = calculateOutbreakDNA(villageReports, false, totalMort);
    const sla = getSLA(sentinel.score);
    const severity = sentinel.score >= 85 ? 'CRITICAL' : (sentinel.score >= 70 ? 'HIGH' : 'MEDIUM');

    if (!caseRecord) {
      const insert = db.prepare(`INSERT INTO cases (syndrome, species, district, village, started_at, status, severity, report_count, signal_score, sla_deadline) VALUES (?, ?, ?, ?, datetime('now'), 'CASE', ?, ?, ?, ?)`);
      const result = insert.run(report.syndrome, report.species, report.district, report.village, severity, villageReports.length, sentinel.score, sla);
      caseRecord = { id: result.lastInsertRowid };
      escalated = true;
      newStatus = 'CASE';
    } else {
      db.prepare(`UPDATE cases SET report_count = ?, severity = ?, signal_score = ?, sla_deadline = ? WHERE id = ?`).run(villageReports.length, severity, sentinel.score, sla, caseRecord.id);
    }
    
    // Tag reports
    const updateReport = db.prepare('UPDATE reports SET case_id = ?, status = ? WHERE id = ?');
    villageReports.forEach(r => updateReport.run(caseRecord.id, newStatus, r.id));

    // 2. Cluster detection (multi-village, 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const fourteenDaysAgoStr = fourteenDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

    const relatedReports = db.prepare(`SELECT r.* FROM reports r JOIN cases c ON r.case_id = c.id WHERE c.syndrome = ? AND c.species = ? AND c.district = ? AND r.captured_at >= ?`).all(report.syndrome, report.species, report.district, fourteenDaysAgoStr);
    
    const distinctVillages = new Set(relatedReports.map(r => r.village));
    
    if (distinctVillages.size >= 2 && relatedReports.length >= 3) {
      let cluster = db.prepare(`SELECT * FROM clusters WHERE case_id = ?`).get(caseRecord.id);
      totalMort = relatedReports.reduce((sum, r) => sum + (r.mortality_count || 0), 0);
      const clusterSentinel = calculateOutbreakDNA(relatedReports, true, totalMort);
      const clusterSla = getSLA(clusterSentinel.score);

      if (!cluster) {
        const insCluster = db.prepare(`INSERT INTO clusters (case_id, label, report_count, status, center_lat, center_lng) VALUES (?, ?, ?, 'CLUSTER', ?, ?)`);
        const cResult = insCluster.run(caseRecord.id, `${report.syndrome} Cluster (${distinctVillages.size} villages)`, relatedReports.length, report.latitude, report.longitude);
        cluster = { id: cResult.lastInsertRowid };
        escalated = true;
        newStatus = 'CLUSTER';
        db.prepare('UPDATE cases SET status = ? WHERE id = ?').run('CLUSTER', caseRecord.id);
        db.prepare('UPDATE reports SET status = ? WHERE case_id = ?').run('CLUSTER', caseRecord.id);
      } else {
        db.prepare(`UPDATE clusters SET report_count = ? WHERE id = ?`).run(relatedReports.length, cluster.id);
      }

      // 3. Suspected Outbreak detection
      if (clusterSentinel.score >= 85 || totalMort > 0) {
        let outbreak = db.prepare(`SELECT * FROM suspected_outbreaks WHERE cluster_id = ?`).get(cluster.id);
        if (!outbreak) {
          db.prepare(`INSERT INTO suspected_outbreaks (cluster_id, status, signal_score, sla_deadline) VALUES (?, 'SUSPECTED', ?, ?)`).run(cluster.id, clusterSentinel.score, clusterSla);
          escalated = true;
        } else {
          db.prepare(`UPDATE suspected_outbreaks SET signal_score = ?, sla_deadline = ? WHERE id = ?`).run(clusterSentinel.score, clusterSla, outbreak.id);
        }
      }
    }
  }

  return { escalated, newStatus };
}

module.exports = { runPipeline, calculateOutbreakDNA, getSLA };
