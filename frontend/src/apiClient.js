import { getAuth, clearAuth } from './authStorage';

/** Map DB/API complaint shape to the fields the UI expects. */
export function normalizeComplaint(complaint) {
  if (!complaint) return complaint;
  return {
    ...complaint,
    text: complaint.text ?? complaint.original_text,
    language: complaint.language ?? complaint.language_detected,
    createdAt: complaint.createdAt ?? complaint.created_at,
  };
}

export function normalizeComplaints(list) {
  return Array.isArray(list) ? list.map(normalizeComplaint) : [];
}

function loginViewForRole(role) {
  if (role === 'CITIZEN') return 'citizen-auth';
  if (role === 'STAFF') return 'staff-auth';
  return 'landing';
}

/**
 * fetch() wrapper for /api/complaints* that attaches Bearer token
 * and redirects on 401.
 */
export async function authFetch(url, options = {}, navigateTo) {
  const auth = getAuth();
  const headers = new Headers(options.headers || {});

  if (auth?.token) {
    headers.set('Authorization', `Bearer ${auth.token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const redirectView = loginViewForRole(auth?.user?.role);
    clearAuth();
    if (typeof navigateTo === 'function') {
      navigateTo(redirectView);
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}
