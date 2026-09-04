/**
 * routes/lab.js — Lab sample management (vet-only)
 * GET /api/lab — all lab samples with linked report info
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

// GET /api/lab
router.get('/', authenticateToken, requireVet, (req, res) => {
  const samples = db.prepare(`
    SELECT
      ls.*,
      r.species,
      r.syndrome,
      r.village,
      r.district,
      r.captured_at  AS report_captured_at
    FROM lab_samples ls
    LEFT JOIN reports r ON r.id = ls.report_id
    ORDER BY ls.submitted_at DESC
  `).all();

  res.json({ samples });
});

module.exports = router;
