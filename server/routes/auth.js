import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();

const STAFF_DEPARTMENTS = [
  'Sanitation Department',
  'Water Supply Department',
  'Electricity Board',
  'Public Works Department',
  'General Administration',
];

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, department: user.department },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    department: user.department,
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { name, username, password, role, department } = req.body;

    if (!name?.trim() || !username?.trim() || !password || !role) {
      return res.status(400).json({ error: 'name, username, password, and role are required.' });
    }

    if (role !== 'CITIZEN' && role !== 'STAFF') {
      return res.status(400).json({ error: 'role must be CITIZEN or STAFF.' });
    }

    let resolvedDepartment = null;

    if (role === 'STAFF') {
      if (!department || !STAFF_DEPARTMENTS.includes(department)) {
        return res.status(400).json({
          error: 'STAFF accounts require a valid department.',
          validDepartments: STAFF_DEPARTMENTS,
        });
      }
      resolvedDepartment = department;
    }

    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
    if (existing) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = db
      .prepare(
        `INSERT INTO users (role, name, username, password_hash, department)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(role, name.trim(), username.trim(), password_hash, resolvedDepartment);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      role,
      department: resolvedDepartment,
    };

    const token = signToken(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    console.error('[POST /api/auth/signup]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'username and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
