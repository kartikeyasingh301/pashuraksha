import { useState, useCallback } from 'react';
import { WifiOff, CheckCircle, Save, AlertTriangle, Loader, MapPin, Send } from 'lucide-react';
import Layout from '../../components/Layout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useSyncContext } from '../../contexts/SyncContext.jsx';
import { useLocation } from '../../hooks/useLocation.js';
import { apiPost } from '../../api/client.js';
import { addToQueue } from '../../sync/syncManager.js';

const SPECIES_LIST = ['Cattle', 'Buffalo', 'Sheep', 'Goat', 'Pig', 'Poultry', 'Dog', 'Other'];
const SYNDROME_LIST = ['FMD', 'PPR', 'BQ', 'Anthrax', 'Rabies', 'Brucellosis', 'Theileriosis', 'Lumpy Skin Disease', 'HPAI', 'Other'];
const SYMPTOM_LIST = ['Fever', 'Lameness', 'Blisters/Ulcers', 'Respiratory distress', 'Neurological signs', 'Diarrhea', 'Sudden death', 'Abortion', 'Swelling', 'Loss of appetite'];

const initialForm = { species: '', syndrome: '', symptoms: [], mortalityCount: 0, animalId: '', village: '', vaccinationStatus: 'Unknown', notes: '' };

export default function ReportForm() {
  const { user } = useAuth();
  const { isOnline, refresh } = useSyncContext();
  const { location, getLocation, loading: locLoading, error: locError } = useLocation();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSymptomToggle(symptom) {
    setForm((prev) => {
      const current = prev.symptoms;
      if (current.includes(symptom)) {
        return { ...prev, symptoms: current.filter((s) => s !== symptom) };
      }
      return { ...prev, symptoms: [...current, symptom] };
    });
  }

  function validate() {
    const newErrors = {};
    if (!form.species) newErrors.species = 'Species is required';
    if (!form.syndrome) newErrors.syndrome = 'Syndrome/condition is required';
    if (!form.village.trim()) newErrors.village = 'Village is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const buildReport = useCallback(() => {
    const capturedAt = new Date().toISOString();
    const uid = user?.id || user?.username || 'u';
    const localId = `${uid}_${Date.now()}_${form.species}_${form.village.trim()}`;
    return {
      localId,
      local_id:           localId,                          // snake_case for backend
      captured_at:        capturedAt,                       // snake_case for backend
      capturedAt,
      species:            form.species,
      syndrome:           form.syndrome,
      symptoms:           form.symptoms,
      mortality_count:    parseInt(form.mortalityCount) || 0,
      mortalityCount:     parseInt(form.mortalityCount) || 0,
      herd_id:            form.animalId.trim() || null,
      animalId:           form.animalId.trim() || null,
      village:            form.village.trim(),
      latitude:           location.lat,
      longitude:          location.lng,
      lat:                location.lat,
      lng:                location.lng,
      vaccination_status: form.vaccinationStatus.toLowerCase(),
      vaccinationStatus:  form.vaccinationStatus,
      notes:              form.notes.trim() || null,
    };
  }, [form, location, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(null);
    const report = buildReport();
    if (isOnline) {
      try {
        const result = await apiPost('/reports', report);
        setSuccess({ type: 'online', id: result.id || result.reportId || result.report?.id || 'submitted' });
        setForm(initialForm);
        await refresh();
      } catch (err) {
        await addToQueue(report);
        await refresh();
        setSuccess({ type: 'offline_fallback', message: err.message });
      }
    } else {
      try {
        await addToQueue(report);
        await refresh();
        setSuccess({ type: 'offline' });
        setForm(initialForm);
      } catch (err) {
        setErrors({ submit: 'Failed to save offline: ' + err.message });
      }
    }
    setSubmitting(false);
  }
  return (
    <Layout title="Report Health Issue" showBack>
      <div className="page-content">
        {!isOnline && (
          <div className="alert alert-info">
            <span>📡</span> You are offline. Report will be saved locally and synced when you reconnect.
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            {success.type === 'online' && <span>✅ Report submitted! ID: <strong>{success.id}</strong></span>}
            {success.type === 'offline' && <span>💾 Saved offline — will sync when connected.</span>}
            {success.type === 'offline_fallback' && <span>⚠️ Saved offline (error: {success.message})</span>}
          </div>
        )}
        {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="report-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="species">Species *</label>
            <select id="species" name="species" className={'form-control' + (errors.species ? ' form-control-error' : '')} value={form.species} onChange={handleChange}>
              <option value="">-- Select species --</option>
              {SPECIES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.species && <span className="form-error">{errors.species}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="syndrome">Syndrome / Condition *</label>
            <select id="syndrome" name="syndrome" className={'form-control' + (errors.syndrome ? ' form-control-error' : '')} value={form.syndrome} onChange={handleChange}>
              <option value="">-- Select condition --</option>
              {SYNDROME_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.syndrome && <span className="form-error">{errors.syndrome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms</label>
            <div className="symptom-grid">
              {SYMPTOM_LIST.map((symptom) => (
                <label key={symptom} className={'symptom-chip' + (form.symptoms.includes(symptom) ? ' selected' : '')}>
                  <input type="checkbox" checked={form.symptoms.includes(symptom)} onChange={() => handleSymptomToggle(symptom)} className="symptom-check-input" />
                  {symptom}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mortalityCount">Mortality Count</label>
            <input id="mortalityCount" name="mortalityCount" type="number" className="form-control" min="0" value={form.mortalityCount} onChange={handleChange} placeholder="0" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="animalId">Animal / Herd ID (optional)</label>
            <input id="animalId" name="animalId" type="text" className="form-control" value={form.animalId} onChange={handleChange} placeholder="e.g. TAG-001" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="village">Village *</label>
            <input id="village" name="village" type="text" className={'form-control' + (errors.village ? ' form-control-error' : '')} value={form.village} onChange={handleChange} placeholder="Enter your village name" />
            {errors.village && <span className="form-error">{errors.village}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">GPS Location</label>
            <button type="button" className="btn btn-outline" onClick={getLocation} disabled={locLoading}>
              {locLoading ? '⏳ Getting location...' : '📍 Get GPS Location'}
            </button>
            {locError && <span className="form-error">{locError}</span>}
            {location.lat && location.lng && (
              <div className="location-display">✅ Lat: {location.lat}, Lng: {location.lng}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Vaccination Status</label>
            <div className="radio-group">
              {['Vaccinated', 'Unvaccinated', 'Unknown'].map((v) => (
                <label key={v} className="radio-label">
                  <input type="radio" name="vaccinationStatus" value={v} checked={form.vaccinationStatus === v} onChange={handleChange} />
                  <span className="radio-text">{v}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">Additional Notes (optional)</label>
            <textarea id="notes" name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} placeholder="Any additional observations..." />
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
            {submitting ? 'Submitting...' : isOnline ? '📤 Submit Report' : '💾 Save Offline'}
          </button>
        </form>
      </div>
    </Layout>
  );
}