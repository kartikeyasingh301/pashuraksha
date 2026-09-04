/**
 * routes/reports.js — Report submission and retrieval
 * POST   /api/reports        — single report
 * POST   /api/reports/batch  — batch of reports
 * GET    /api/reports        — paginated list
 * GET    /api/reports/:id    — single report
 */

'use strict';

const express  = require('express');
const { v4: uuidv4 } = require('uuid');
const db       = require('../db/database');
const { authenticateToken } = require('../middleware/auth');
const dedup    = require('../middleware/dedup');
const { runPipeline } = require('../pipeline/engine');

const router = express.Router();

const REQUIRED_FIELDS = ['species', 'syndrome', 'captured_at'];

function validateReport(body) {
  const missing = REQUIRED_FIELDS.filter(f => !body[f]);
  return missing;
}

function insertReport(body, userId) {
  const id = uuidv4();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  db.prepare(`
    INSERT INTO reports
      (id, local_id, user_id, species, syndrome, symptoms, mortality_count,
       herd_id, animal_id, village, district, latitude, longitude,
       vaccination_status, captured_at, synced_at, status, notes)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'REPORT', ?)
  `).run(
    id,
    body.local_id   || null,
    userId,
    body.species,
    body.syndrome,
    body.symptoms    || null,
    body.mortality_count || 0,
    body.herd_id     || null,
    body.animal_id   || null,
    body.village     || null,
    body.district    || null,
    body.latitude    != null ? body.latitude  : null,
    body.longitude   != null ? body.longitude : null,
    body.vaccination_status || 'unknown',
    body.captured_at,
    now,
    body.notes       || null
  );

  if (body.local_id) {
    db.prepare('INSERT OR IGNORE INTO sync_log (local_id, report_id) VALUES (?, ?)')
      .run(body.local_id, id);
  }

  return id;
}

// POST /api/reports — single report
router.post('/', authenticateToken, dedup, (req, res) => {
  const missing = validateReport(req.body);
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  try {
    const reportId = insertReport(req.body, req.user.id);
    const pipeline = runPipeline(db, reportId);
    const report   = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
    res.status(201).json({ report, pipeline });
  } catch (err) {
    console.error('[reports] POST error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports/batch
router.post('/batch', authenticateToken, (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Body must be an array of reports' });
  }

  const synced     = [];
  const failed     = [];
  const duplicates = [];

  for (const item of items) {
    try {
      // Dedup check
      if (item.local_id) {
        const existing = db.prepare(
          'SELECT report_id FROM sync_log WHERE local_id = ?'
        ).get(item.local_id);
        if (existing) {
          duplicates.push({ local_id: item.local_id, report_id: existing.report_id });
          continue;
        }
      }

      const missing = validateReport(item);
      if (missing.length) {
        failed.push({ local_id: item.local_id, error: `Missing: ${missing.join(', ')}` });
        continue;
      }

      const reportId = insertReport(item, req.user.id);
      const pipeline = runPipeline(db, reportId);
      const report   = db.prepare('SELECT * FROM reports WHERE id = ?').get(reportId);
      synced.push({ report, pipeline });
    } catch (err) {
      failed.push({ local_id: item.local_id, error: err.message });
    }
  }

  res.json({ synced, failed, duplicates });
});

// GET /api/reports
router.get('/', authenticateToken, (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  || '50', 10), 200);
  const offset = parseInt(req.query.offset || '0', 10);

  let rows, total;
  if (req.user.role === 'vet') {
    rows  = db.prepare('SELECT * FROM reports ORDER BY created_at DESC LIMIT ? OFFSET ?')
               .all(limit, offset);
    total = db.prepare('SELECT COUNT(*) as c FROM reports').get().c;
  } else {
    rows  = db.prepare(
               'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
             ).all(req.user.id, limit, offset);
    total = db.prepare('SELECT COUNT(*) as c FROM reports WHERE user_id = ?')
               .get(req.user.id).c;
  }

  res.json({ reports: rows, total, limit, offset });
});

// GET /api/reports/:id
router.get('/:id', authenticateToken, (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  // Farmers can only see their own reports
  if (req.user.role === 'farmer' && report.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json({ report });
});

module.exports = router;
