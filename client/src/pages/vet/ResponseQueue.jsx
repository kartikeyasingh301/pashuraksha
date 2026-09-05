import { useState, useEffect } from 'react';
import Layout from '../../components/Layout.jsx';
import PipelineTag from '../../components/PipelineTag.jsx';
import { apiGet, apiPost } from '../../api/client.js';
import { CheckCircle, MapPin } from 'lucide-react';

const ACTION_TYPES = ['field_visit', 'quarantine', 'vaccination', 'sample_collection'];

function ResponseForm({ caseId, onSubmit }) {
  const [form, setForm] = useState({ actionType: 'field_visit', description: '', scheduledDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(caseId, form);
      setSuccess(true);
      setForm({ actionType: 'field_visit', description: '', scheduledDate: '' });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='response-form'>
      {success && <div className='alert alert-success'>Response added successfully!</div>}
      <div className='form-row'>
        <div className='form-group'>
          <label className='form-label'>Action Type</label>
          <select name='actionType' className='form-control' value={form.actionType} onChange={handleChange}>
            {ACTION_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <div className='form-group'>
          <label className='form-label'>Scheduled Date</label>
          <input type='date' name='scheduledDate' className='form-control' value={form.scheduledDate} onChange={handleChange} />
        </div>
      </div>
      <div className='form-group'>
        <label className='form-label'>Description</label>
        <textarea name='description' className='form-control' rows={2} value={form.description} onChange={handleChange} placeholder='Describe the planned response action...' />
      </div>
      <button type='submit' className='btn btn-primary' disabled={submitting}>{submitting ? 'Adding...' : 'Add Response'}</button>
    </form>
  );
}

export default function ResponseQueue() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await apiGet('/cases');
        const all = data.cases || data || [];
        setCases(all.filter((c) => c.status !== 'RESOLVED'));
      } catch (err) {
        setError(err.message || 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  async function handleAddResponse(caseId, formData) {
    await apiPost('/cases/' + caseId + '/response', formData);
    const data = await apiGet('/cases');
    const all = data.cases || data || [];
    setCases(all.filter((c) => c.status !== 'RESOLVED'));
  }

  return (
    <Layout title='Response Queue' showBack>
      <div className='page-content'>
        {error && <div className='alert alert-error'>{error}</div>}
        {loading ? (
          <div className='loading-state'>Loading response queue...</div>
        ) : cases.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>✅</div>
            <p>No cases pending response. Queue is clear!</p>
          </div>
        ) : (
          <div className='response-list'>
            {cases.map((c) => (
              <div key={c.id} className='response-case-card card'>
                <div className='response-case-header' onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                  <div>
                    <strong>{c.syndrome || 'Unknown'}</strong>
                    <span className='case-species'> — {c.species || 'Unknown'}</span>
                    <div className='case-location'>📍 {c.village || c.location || ''}</div>
                  </div>
                  <div className='case-right'>
                    <PipelineTag status={c.status || 'CASE'} />
                    <span className='expand-icon'>{expandedId === c.id ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expandedId === c.id && (
                  <div className='response-expand'>
                    {c.responses && c.responses.length > 0 && (
                      <div className='existing-responses'>
                        <h4>Existing Responses</h4>
                        {c.responses.map((r, i) => (
                          <div key={i} className='existing-response-item'>
                            <strong>{r.actionType}</strong> — {r.description}
                            {r.scheduledDate && <span> (Scheduled: {new Date(r.scheduledDate).toLocaleDateString('en-IN')})</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <h4 className='add-response-title'>Add Response</h4>
                    <ResponseForm caseId={c.id} onSubmit={handleAddResponse} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
