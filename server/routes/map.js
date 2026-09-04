/**
 * routes/map.js — GeoJSON map data
 * GET /api/map/incidents — GeoJSON FeatureCollection of all reports with coordinates
 */

'use strict';

const express = require('express');
const db      = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/map/incidents
router.get('/incidents', authenticateToken, (req, res) => {
  let rows;
  if (req.user.role === 'vet') {
    rows = db.prepare(`
      SELECT id, species, syndrome, status, village, district,
             latitude, longitude, captured_at, mortality_count
      FROM reports
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `).all();
  } else {
    rows = db.prepare(`
      SELECT id, species, syndrome, status, village, district,
             latitude, longitude, captured_at, mortality_count
      FROM reports
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND user_id = ?
    `).all(req.user.id);
  }

  const geojson = {
    type: 'FeatureCollection',
    features: rows.map(r => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [r.longitude, r.latitude],
      },
      properties: {
        id:             r.id,
        species:        r.species,
        syndrome:       r.syndrome,
        status:         r.status,
        village:        r.village,
        district:       r.district,
        captured_at:    r.captured_at,
        mortality_count: r.mortality_count,
      },
    })),
  };

  res.json(geojson);
});

module.exports = router;
