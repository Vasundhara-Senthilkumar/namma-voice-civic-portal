import { Router } from 'express';
import db from '../db.js';
import { requireRole } from '../auth.middleware.js';

const router = Router();

const CATEGORY_TO_DEPARTMENT = {
  GARBAGE: 'Sanitation Department',
  WATER: 'Water Supply Department',
  ELECTRICITY: 'Electricity Board',
  ROAD: 'Public Works Department',
  OTHER: 'General Administration',
};

const VALID_STATUSES = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

function classifyComplaint(text) {
  const lowerText = text.toLowerCase();

  let category = 'OTHER';
  if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('pipe')) {
    category = 'WATER';
  } else if (lowerText.includes('garbage') || lowerText.includes('trash') || lowerText.includes('waste')) {
    category = 'GARBAGE';
  } else if (lowerText.includes('electric') || lowerText.includes('power') || lowerText.includes('wire')) {
    category = 'ELECTRICITY';
  } else if (lowerText.includes('road') || lowerText.includes('pothole')) {
    category = 'ROAD';
  }

  let urgency = 'LOW';
  if (
    lowerText.includes('urgent') ||
    lowerText.includes('days') ||
    lowerText.includes('since') ||
    lowerText.includes('emergency')
  ) {
    urgency = 'HIGH';
  } else if (lowerText.includes('please') || lowerText.includes('soon')) {
    urgency = 'MEDIUM';
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  const summary = words.slice(0, 10).join(' ') + '...';

  return { category, urgency, summary };
}

function getComplaintById(id) {
  return db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
}

// POST /api/complaints
router.post('/', requireRole('CITIZEN'), (req, res) => {
  const { text, language, location } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Complaint text is required.' });
  }

  const { category, urgency, summary } = classifyComplaint(text);
  const department = CATEGORY_TO_DEPARTMENT[category] || CATEGORY_TO_DEPARTMENT.OTHER;
  const languageDetected = language || 'en-IN';
  const resolvedLocation = location?.trim() || 'Unspecified Location';

  const result = db
    .prepare(
      `INSERT INTO complaints (
         citizen_id, original_text, language_detected, summary,
         category, department, urgency, status, location
       ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`
    )
    .run(
      req.user.id,
      text.trim(),
      languageDetected,
      summary,
      category,
      department,
      urgency,
      resolvedLocation
    );

  const complaint = getComplaintById(result.lastInsertRowid);
  console.log(
    `[POST /api/complaints] Created: ${complaint.id} - ${complaint.category} (${complaint.urgency}) -> ${complaint.department}`
  );
  return res.status(201).json(complaint);
});

// GET /api/complaints/mine  (must be before /:id)
router.get('/mine', requireRole('CITIZEN'), (req, res) => {
  const complaints = db
    .prepare(
      'SELECT * FROM complaints WHERE citizen_id = ? ORDER BY created_at DESC'
    )
    .all(req.user.id);

  return res.json(complaints);
});

// GET /api/complaints
router.get('/', requireRole('STAFF'), (req, res) => {
  const { category, urgency, status, department } = req.query;

  const filters = [];
  const params = [];

  const departmentFilter =
    department && department !== 'ALL' ? department : req.user.department;

  if (departmentFilter) {
    filters.push('department = ?');
    params.push(departmentFilter);
  }

  if (category && category !== 'ALL') {
    filters.push('category = ?');
    params.push(category);
  }
  if (urgency && urgency !== 'ALL') {
    filters.push('urgency = ?');
    params.push(urgency);
  }
  if (status && status !== 'ALL') {
    filters.push('status = ?');
    params.push(status);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const complaints = db
    .prepare(`SELECT * FROM complaints ${where} ORDER BY created_at DESC`)
    .all(...params);

  return res.json({ complaints, total: complaints.length });
});

// GET /api/complaints/:id
router.get('/:id', requireRole('STAFF'), (req, res) => {
  const complaint = getComplaintById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  return res.json(complaint);
});

// PATCH /api/complaints/:id/status
router.patch('/:id/status', requireRole('STAFF'), (req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'status must be one of: PENDING, IN_PROGRESS, RESOLVED',
    });
  }

  const existing = getComplaintById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  db.prepare(
    `UPDATE complaints
     SET status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(status, req.params.id);

  const complaint = getComplaintById(req.params.id);
  console.log(`[PATCH /api/complaints/${req.params.id}/status] Updated status to: ${complaint.status}`);
  return res.json(complaint);
});

export default router;
