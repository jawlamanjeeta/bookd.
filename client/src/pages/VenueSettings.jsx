import { useEffect, useState } from 'react'
import { getMyVenues, updateVenueSettings } from '../api/dashboard.api'
import Navbar from '../components/Navbar'

const VenueSettings = () => {
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '',
    openingHours: { open: '09:00', close: '21:00' },
    rules: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyVenues().then((res) => {
      setVenues(res.data)
      if (res.data.length > 0) setSelectedVenue(res.data[0])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedVenue) return
    setForm({
      name: selectedVenue.name || '',
      description: selectedVenue.description || '',
      openingHours: selectedVenue.openingHours || { open: '09:00', close: '21:00' },
      rules: selectedVenue.rules?.join('\n') || '',
    })
  }, [selectedVenue])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSuccess(false)
  }

  const handleHoursChange = (e) => {
    setForm({ ...form, openingHours: { ...form.openingHours, [e.target.name]: e.target.value } })
  }

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess(false)
    try {
      await updateVenueSettings(selectedVenue._id, {
        ...form,
        rules: form.rules.split('\n').map((r) => r.trim()).filter(Boolean),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings')
    } finally { setLoading(false) }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Owner Dashboard</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Venue Settings</h1>
        </div>

        {venues.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {venues.map((v) => (
              <button
                key={v._id}
                className={selectedVenue?._id === v._id ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setSelectedVenue(v)}
              >{v.name}</button>
            ))}
          </div>
        )}

        {venues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <h3>No venues found</h3>
            <p>You haven't created any venues yet</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div className="form-group">
              <label className="form-label">Venue Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Venue name" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description" rows="4"
                value={form.description} onChange={handleChange}
                placeholder="Describe your venue..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Opening Time</label>
                <input type="time" name="open" value={form.openingHours.open} onChange={handleHoursChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Closing Time</label>
                <input type="time" name="close" value={form.openingHours.close} onChange={handleHoursChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rules (one per line)</label>
              <textarea
                name="rules" rows="4"
                value={form.rules} onChange={handleChange}
                placeholder="No smoking&#10;Smart casual dress code&#10;Reservations required"
                style={{ resize: 'vertical' }}
              />
            </div>

            {error && <p className="error">{error}</p>}
            {success && (
              <p style={{ color: 'var(--success)', fontSize: '0.875rem', padding: '0.65rem 0.9rem', background: 'rgba(52,211,153,0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--success)' }}>
                ✓ Settings saved successfully
              </p>
            )}

            <button className="btn-primary" style={{ padding: '0.85rem' }} onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default VenueSettings