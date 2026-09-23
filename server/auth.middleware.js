import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header. Expected: Bearer <token>.' });
  }

  const token = header.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: 'Authentication token is missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      department: decoded.department ?? null,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    authenticate(req, res, () => {
      if (req.user.role !== role) {
        return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
      }
      next();
    });
  };
}
