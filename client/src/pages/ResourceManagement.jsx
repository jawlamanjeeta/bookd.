import { useEffect, useState } from 'react'
import { getMyVenues, getResourcesByVenue, createResource, deleteResource } from '../api/dashboard.api'
import Navbar from '../components/Navbar'

const TYPES = ['table', 'room', 'court', 'desk']

const empty = { name: '', type: 'room', capacity: 1, pricePerHour: 0, amenities: '' }

const ResourceManagement = () => {
  const [venues, setVenues] = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [resources, setResources] = useState([])
  const [form, setForm] = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyVenues().then((res) => {
      setVenues(res.data)
      if (res.data.length > 0) setSelectedVenue(res.data[0])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (!selectedVenue) return
    getResourcesByVenue(selectedVenue._id)
      .then((res) => setResources(res.data))
      .catch(console.error)
  }, [selectedVenue])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async () => {
    if (!form.name) return setError('Resource name is required')
    setLoading(true); setError('')
    try {
      await createResource(selectedVenue._id, {
        ...form,
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
        amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      })
      setForm(empty); setShowForm(false)
      const res = await getResourcesByVenue(selectedVenue._id)
      setResources(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create resource')
    } finally { setLoading(false) }
  }

  const handleDelete = async (venueId, resourceId) => {
    if (!confirm('Delete this resource?')) return
    try {
      await deleteResource(venueId, resourceId)
      setResources((prev) => prev.filter((r) => r._id !== resourceId))
    } catch (err) {
      alert('Failed to delete resource')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Owner Dashboard</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Resources</h1>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Resource'}
          </button>
        </div>

        {/* Venue Selector */}
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

        {venues.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <h3>No venues found</h3>
            <p>Create a venue first to manage resources</p>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>New Resource</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" placeholder="e.g. Court 1" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Price per Hour (₹)</label>
                <input name="pricePerHour" type="number" min="0" value={form.pricePerHour} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Amenities (comma separated)</label>
              <input name="amenities" placeholder="WiFi, Projector, Whiteboard" value={form.amenities} onChange={handleChange} />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating...' : 'Create Resource'}
            </button>
          </div>
        )}

        {/* Resources List */}
        {resources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🪑</div>
            <h3>No resources yet</h3>
            <p>Add your first bookable resource above</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resources.map((r) => (
              <div key={r._id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '1rem', flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.7rem' }}>{r.type}</span>
                    <span>👥 {r.capacity}</span>
                    <span style={{ color: 'var(--amber)' }}>₹{r.pricePerHour}/hr</span>
                    {r.amenities?.length > 0 && <span>✨ {r.amenities.join(', ')}</span>}
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(selectedVenue._id, r._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ResourceManagement