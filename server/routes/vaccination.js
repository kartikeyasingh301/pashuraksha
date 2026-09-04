/**
 * routes/vaccination.js — Vaccination gap analysis (vet-only)
 * GET /api/vaccination/gaps
 *   Returns villages where:
 *   - unvaccinated count > 2, OR
 *   - unvaccinated % > 40%
 *   grouped by village + species
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken, requireVet } = require('../middleware/auth');

const router = express.Router();

// GET /api/vaccination/gaps
router.get('/gaps', authenticateToken, requireVet, (req, res) => {
  const rows = db.prepare(`
    SELECT
      village,
      species,
      COUNT(*) AS total_reports,
      SUM(CASE WHEN vaccination_status = 'unvaccinated' THEN 1 ELSE 0 END) AS unvaccinated_count,
      ROUND(
        100.0 * SUM(CASE WHEN vaccination_status = 'unvaccinated' THEN 1 ELSE 0 END)
              / COUNT(*),
        1
      ) AS unvaccinated_pct
    FROM reports
    WHERE village IS NOT NULL
    GROUP BY village, species
    HAVING
      SUM(CASE WHEN vaccination_status = 'unvaccinated' THEN 1 ELSE 0 END) > 2
      OR (
        100.0 * SUM(CASE WHEN vaccination_status = 'unvaccinated' THEN 1 ELSE 0 END)
              / COUNT(*) > 40
      )
    ORDER BY unvaccinated_pct DESC, unvaccinated_count DESC
  `).all();

  res.json({ gaps: rows });
});

module.exports = router;
