/**
 * auth.js — JWT authentication & authorization middleware
 */

'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pashusuraksha_secret_2024';

/**
 * Verifies Bearer token and attaches req.user = { id, username, role }
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

/**
 * Role guard — must be used AFTER authenticateToken.
 * Allows only users with role === 'vet'.
 */
function requireVet(req, res, next) {
  if (!req.user || req.user.role !== 'vet') {
    return res.status(403).json({ error: 'Vet access required' });
  }
  next();
}

module.exports = { authenticateToken, requireVet };
