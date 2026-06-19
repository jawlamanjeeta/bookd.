import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResourceById, createBooking, confirmBooking } from '../api/booking.api'
import ConflictAlert from '../components/ConflictAlert'
import Navbar from '../components/Navbar'
import { formatSlot } from '../utils/formatSlot'

const BookingPage = () => {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [form, setForm] = useState({ startTime: '', endTime: '', guests: 1, notes: '' })
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(null)

  useEffect(() => {
    getResourceById(resourceId).then((res) => setResource(res.data)).catch(console.error)
  }, [resourceId])

  const duration = form.startTime && form.endTime
    ? Math.max(0, (new Date(form.endTime) - new Date(form.startTime)) / (1000 * 60 * 60))
    : 0

  const totalPrice = duration * (resource?.pricePerHour || 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSuggestions([]); setError('')
  }

  const handleBook = async () => {
    if (!form.startTime || !form.endTime) return setError('Please select start and end time')
    if (new Date(form.startTime) >= new Date(form.endTime)) return setError('End time must be after start time')
    setLoading(true)
    try {
      const res = await createBooking({ resourceId, ...form, totalPrice })
      setPending(res.data)
    } catch (err) {
      if (err.response?.status === 409) {
        setSuggestions(err.response.data.suggestions || [])
        setError(err.response.data.message)
      } else {
        setError('Something went wrong. Try again.')
      }
    } finally { setLoading(false) }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await confirmBooking(pending._id)
      navigate('/booking/success', { state: { booking: pending, resource } })
    } catch (err) {
      setError('Failed to confirm booking.')
    } finally { setLoading(false) }
  }

  const handleSelectSuggestion = (slot) => {
    setForm({
      ...form,
      startTime: new Date(slot.startTime).toISOString().slice(0, 16),
      endTime: new Date(slot.endTime).toISOString().slice(0, 16),
    })
    setSuggestions([])
  }

  if (!resource) return <><Navbar /><div className="loading">Loading...</div></>

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <h1>Reserve Your Spot</h1>
        <p className="subtitle">{resource.name} · {resource.venue?.name}</p>

        <div className="booking-form">
          {!pending ? (
            <>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Guests</label>
                <input type="number" name="guests" min="1" max={resource.capacity} value={form.guests} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea name="notes" rows="2" value={form.notes} onChange={handleChange} placeholder="Any special requests..." style={{ resize: 'none' }} />
              </div>

              {duration > 0 && (
                <div className="booking-summary">
                  <div className="booking-summary-row"><span>Duration</span><span>{duration.toFixed(1)} hrs</span></div>
                  <div className="booking-summary-row"><span>Rate</span><span>₹{resource.pricePerHour}/hr</span></div>
                  <div className="booking-summary-row total"><span>Total</span><span>₹{totalPrice.toFixed(0)}</span></div>
                </div>
              )}

              {error && <p className="error">{error}</p>}
              <ConflictAlert suggestions={suggestions} onSelectSlot={handleSelectSuggestion} />

              <button className="btn-primary" style={{ padding: '0.85rem' }} onClick={handleBook} disabled={loading}>
                {loading ? 'Checking availability...' : 'Reserve Slot'}
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏳</div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Slot reserved!</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Confirm within 15 minutes or the slot will be released.
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.75rem' }}>
                  {formatSlot(pending.startTime, pending.endTime)}
                </p>
              </div>
              {error && <p className="error">{error}</p>}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setPending(null)}>Back</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleConfirm} disabled={loading}>
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BookingPage