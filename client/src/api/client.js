const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('pasu_token');
}

function getHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(res);
}

export async function apiPost(path, data) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiPatch(path, data) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Backend POST /api/reports/batch expects a raw array of report objects
export async function apiBatch(reports) {
  const normalized = reports.map(r => ({
    // Map camelCase → snake_case expected by backend
    local_id:           r.localId          || r.local_id || null,
    species:            r.species,
    syndrome:           r.syndrome,
    symptoms:           Array.isArray(r.symptoms) ? r.symptoms.join(', ') : (r.symptoms || null),
    mortality_count:    r.mortalityCount    ?? r.mortality_count ?? 0,
    herd_id:            r.herdId            || r.herd_id   || null,
    animal_id:          r.animalId          || r.animal_id || null,
    village:            r.village           || null,
    district:           r.district          || null,
    latitude:           r.lat               ?? r.latitude  ?? null,
    longitude:          r.lng               ?? r.longitude ?? null,
    vaccination_status: r.vaccinationStatus || r.vaccination_status || 'unknown',
    captured_at:        r.capturedAt        || r.captured_at,
    notes:              r.notes             || null,
  }));
  return apiPost('/reports/batch', normalized);
}