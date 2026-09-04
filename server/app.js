/**
 * app.js — PashuSuraksha Express application entry point
 */

'use strict';

require('dotenv').config();

// Initialise DB (runs schema + seeds) before mounting routes
const db = require('./db/database');

const express = require('express');
const cors    = require('cors');

const authRouter        = require('./routes/auth');
const reportsRouter     = require('./routes/reports');
const casesRouter       = require('./routes/cases');
const clustersRouter    = require('./routes/clusters');
const alertsRouter      = require('./routes/alerts');
const mapRouter         = require('./routes/map');
const vaccinationRouter = require('./routes/vaccination');
const labRouter         = require('./routes/lab');
const outbreaksRouter   = require('./routes/outbreaks');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check (unauthenticated) ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PashuSuraksha API', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/reports',     reportsRouter);
app.use('/api/cases',       casesRouter);
app.use('/api/clusters',    clustersRouter);
app.use('/api/alerts',      alertsRouter);
app.use('/api/map',         mapRouter);
app.use('/api/vaccination', vaccinationRouter);
app.use('/api/lab',         labRouter);
app.use('/api/outbreaks',   outbreaksRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│       PashuSuraksha API Server                  │');
  console.log(`│  Listening on  http://localhost:${PORT}            │`);
  console.log('│                                                  │');
  console.log('│  Demo credentials:                               │');
  console.log('│    Farmer  →  farmer1 / farmer123                │');
  console.log('│    Vet     →  vet1    / vet123                   │');
  console.log('│                                                  │');
  console.log('│  Health: GET /api/health                         │');
  console.log('└─────────────────────────────────────────────────┘');
  console.log('');
});

module.exports = app; // for testing
