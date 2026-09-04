/**
 * routes/outbreaks.js — Suspected outbreak management (vet-only)
 * GET  /api/outbreaks
 * POST /api/outbreaks/:id/confirm  — ONLY endpoint that sets status='CONFIRMED'
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

// GET /api/outbreaks
router.get('/', authenticateToken, requireVet, (req, res) => {
  const outbreaks = db.prepare(`
    SELECT
      so.*,
      cl.case_id,
      cl.label        AS cluster_label,
      cl.center_lat,
      cl.center_lng,
      cl.report_count AS cluster_report_count,
      c.syndrome,
      c.species,
      c.district,
      c.severity
    FROM suspected_outbreaks so
    LEFT JOIN clusters cl ON cl.id = so.cluster_id
    LEFT JOIN cases    c  ON c.id  = cl.case_id
    ORDER BY so.suspected_at DESC
  `).all();

  res.json({ outbreaks });
});

// POST /api/outbreaks/:id/confirm — confirm a suspected outbreak (vet only)
router.post('/:id/confirm', authenticateToken, requireVet, (req, res) => {
  const outbreak = db.prepare('SELECT * FROM suspected_outbreaks WHERE id = ?')
                     .get(req.params.id);
  if (!outbreak) {
    return res.status(404).json({ error: 'Outbreak not found' });
  }
  if (outbreak.status === 'CONFIRMED') {
    return res.status(409).json({ error: 'Outbreak already confirmed' });
  }

  // Update outbreak
  db.prepare(`
    UPDATE suspected_outbreaks
    SET status       = 'CONFIRMED',
        confirmed_at = datetime('now'),
        confirmed_by = ?
    WHERE id = ?
  `).run(req.user.id, outbreak.id);

  // Update the linked cluster
  if (outbreak.cluster_id) {
    db.prepare(`UPDATE clusters SET status = 'CONFIRMED' WHERE id = ?`)
      .run(outbreak.cluster_id);

    // Update the linked case
    const cluster = db.prepare('SELECT case_id FROM clusters WHERE id = ?')
                      .get(outbreak.cluster_id);
    if (cluster && cluster.case_id) {
      db.prepare(`UPDATE cases SET status = 'CONFIRMED' WHERE id = ?`)
        .run(cluster.case_id);
    }
  }

  const updated = db.prepare('SELECT * FROM suspected_outbreaks WHERE id = ?')
                    .get(outbreak.id);

  res.json({ outbreak: updated });
});

module.exports = router;
