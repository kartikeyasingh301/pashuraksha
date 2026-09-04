/**
 * routes/alerts.js — Alert dashboard (vet-only)
 * GET /api/alerts
 *   Returns:
 *     critical   — cases with severity=CRITICAL or active SUSPECTED outbreaks
 *     zoonotic   — reports of zoonotic syndromes in last 30 days
 *     emerging   — clusters detected in last 7 days
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

const ZOONOTIC_SYNDROMES = ['Rabies', 'Anthrax', 'Brucellosis'];

// GET /api/alerts
router.get('/', authenticateToken, requireVet, (req, res) => {
  // Critical: CRITICAL severity cases + active SUSPECTED outbreaks
  const criticalCases = db.prepare(`
    SELECT * FROM cases WHERE severity = 'CRITICAL' ORDER BY created_at DESC
  `).all();

  const suspectedOutbreaks = db.prepare(`
    SELECT
      so.*,
      cl.case_id,
      cl.label       AS cluster_label,
      cl.center_lat,
      cl.center_lng,
      c.syndrome,
      c.species,
      c.district
    FROM suspected_outbreaks so
    LEFT JOIN clusters cl ON cl.id = so.cluster_id
    LEFT JOIN cases    c  ON c.id  = cl.case_id
    WHERE so.status IN ('SUSPECTED')
    ORDER BY so.suspected_at DESC
  `).all();

  // Zoonotic: last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

  const placeholders = ZOONOTIC_SYNDROMES.map(() => '?').join(', ');
  const zoonotic = db.prepare(`
    SELECT * FROM reports
    WHERE syndrome IN (${placeholders})
      AND captured_at >= ?
    ORDER BY captured_at DESC
  `).all(...ZOONOTIC_SYNDROMES, thirtyDaysAgoStr);

  // Emerging clusters: last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().replace('T', ' ').substring(0, 19);

  const emerging = db.prepare(`
    SELECT
      cl.*,
      c.syndrome,
      c.species,
      c.district,
      c.severity
    FROM clusters cl
    LEFT JOIN cases c ON c.id = cl.case_id
    WHERE cl.detected_at >= ?
    ORDER BY cl.detected_at DESC
  `).all(sevenDaysAgoStr);

  res.json({
    critical: {
      cases:    criticalCases,
      outbreaks: suspectedOutbreaks,
    },
    zoonotic,
    emerging,
  });
});

module.exports = router;
