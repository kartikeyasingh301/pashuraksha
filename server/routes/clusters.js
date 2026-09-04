/**
 * routes/clusters.js — Cluster data (vet-only)
 * GET /api/clusters — all clusters with linked case info
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

// GET /api/clusters
router.get('/', authenticateToken, requireVet, (req, res) => {
  const clusters = db.prepare(`
    SELECT
      cl.*,
      c.syndrome      AS case_syndrome,
      c.species       AS case_species,
      c.district      AS case_district,
      c.severity      AS case_severity,
      c.status        AS case_status,
      c.started_at    AS case_started_at
    FROM clusters cl
    LEFT JOIN cases c ON c.id = cl.case_id
    ORDER BY cl.detected_at DESC
  `).all();

  res.json({ clusters });
});

module.exports = router;
