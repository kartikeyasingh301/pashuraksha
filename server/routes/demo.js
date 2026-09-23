'use strict';

const express = require('express');
const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const { runPipeline } = require('../pipeline/engine');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/simulate-outbreak', authenticateToken, (req, res) => {
  try {
    const now = new Date();
    const dates = [
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      now.toISOString().replace('T', ' ').substring(0, 19)
    ];

    const reports = [
      { village: 'Wagholi', lat: 18.5793, lng: 73.9797, symp: 'Fever, Blisters/Ulcers', mort: 0 },
      { village: 'Wagholi', lat: 18.5810, lng: 73.9800, symp: 'Fever, Excessive Salivation', mort: 0 },
      { village: 'Lonikand', lat: 18.6181, lng: 74.0267, symp: 'Fever, Blisters/Ulcers, Lameness', mort: 0 },
      { village: 'Lonikand', lat: 18.6190, lng: 74.0250, symp: 'Fever, Sudden death', mort: 1 },
      { village: 'Bakori', lat: 18.6000, lng: 74.0100, symp: 'Fever, Blisters/Ulcers', mort: 0 }
    ];

    let lastId;
    const insert = db.prepare(`
      INSERT INTO reports (id, local_id, user_id, species, syndrome, symptoms, mortality_count, village, district, latitude, longitude, captured_at, synced_at, status)
      VALUES (?, ?, ?, 'Cattle', 'FMD', ?, ?, ?, 'Pune', ?, ?, ?, ?, 'REPORT')
    `);

    for (let i = 0; i < reports.length; i++) {
      const id = uuidv4();
      lastId = id;
      insert.run(id, `demo_sim_${id}`, req.user.id || 1, reports[i].symp, reports[i].mort, reports[i].village, reports[i].lat, reports[i].lng, dates[i], dates[i]);
      runPipeline(db, id); // Process pipeline for each to build the case/cluster naturally
    }

    res.json({ success: true, message: 'Simulated 5 reports across 3 villages with 1 mortality. Sentinel engine triggered.', last_report_id: lastId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
