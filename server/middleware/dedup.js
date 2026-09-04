/**
 * dedup.js — Duplicate report prevention middleware.
 * Checks sync_log for the incoming local_id; if found, short-circuits with 200.
 */

'use strict';

const db = require('../db/database');

function dedup(req, res, next) {
  const { local_id } = req.body;

  // If no local_id supplied, skip dedup check and let the route handle it
  if (!local_id) {
    return next();
  }

  try {
    const existing = db
      .prepare('SELECT local_id, report_id FROM sync_log WHERE local_id = ?')
      .get(local_id);

    if (existing) {
      return res.status(200).json({
        deduplicated: true,
        report_id: existing.report_id,
        message: 'Report already synced',
      });
    }

    next();
  } catch (err) {
    // On DB error, allow the request through — the route will handle insertion
    console.error('[dedup] DB error during dedup check:', err.message);
    next();
  }
}

module.exports = dedup;
