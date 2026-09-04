/**
 * routes/cases.js — Case management (vet-only)
 * GET  /api/cases
 * GET  /api/cases/:id
 * POST /api/cases/:id/response
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

// GET /api/cases — all cases with report_count
router.get('/', authenticateToken, requireVet, (req, res) => {
  const cases = db.prepare(`
    SELECT c.*,
           (SELECT COUNT(*) FROM reports r WHERE r.case_id = c.id) AS report_count
    FROM cases c
    ORDER BY c.created_at DESC
  `).all();
  res.json({ cases });
});

// GET /api/cases/:id — case detail with linked reports
router.get('/:id', authenticateToken, requireVet, (req, res) => {
  const caseRecord = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
  if (!caseRecord) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const reports = db.prepare('SELECT * FROM reports WHERE case_id = ? ORDER BY captured_at ASC')
                    .all(req.params.id);

  const clusters = db.prepare('SELECT * FROM clusters WHERE case_id = ?').all(req.params.id);

  res.json({ case: caseRecord, reports, clusters });
});

// POST /api/cases/:id/response — add a vet response to a case's outbreak
router.post('/:id/response', authenticateToken, requireVet, (req, res) => {
  const caseRecord = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
  if (!caseRecord) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const { outbreak_id, action_type, description, scheduled_at } = req.body;

  if (!action_type || !description) {
    return res.status(400).json({ error: 'action_type and description are required' });
  }

  const result = db.prepare(`
    INSERT INTO responses (outbreak_id, vet_id, action_type, description, scheduled_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    outbreak_id || null,
    req.user.id,
    action_type,
    description,
    scheduled_at || null
  );

  const response = db.prepare('SELECT * FROM responses WHERE id = ?')
                     .get(result.lastInsertRowid);

  res.status(201).json({ response });
});

module.exports = router;
