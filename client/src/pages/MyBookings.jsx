import { useEffect, useState } from 'react'
import { getMyBookings, cancelBooking } from '../api/booking.api'
import Navbar from '../components/Navbar'
import { formatSlot } from '../utils/formatSlot'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { label: 'Upcoming', statuses: ['pending', 'confirmed'] },
  { label: 'Completed', statuses: ['completed'] },
  { label: 'Cancelled', statuses: ['cancelled', 'released'] },
]

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchBookings = () => {
    setLoading(true)
    getMyBookings()
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      fetchBookings()
    } catch (err) {
      alert('Failed to cancel booking')
    }
  }

  const filtered = bookings.filter((b) => TABS[activeTab].statuses.includes(b.status))

  return (
    <>
      <Navbar />
      <div className="my-bookings-page">
        <h1>My Bookings</h1>

        <div className="tabs">
          {TABS.map((t, i) => (
            <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading" style={{ height: '200px' }}>Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No {TABS[activeTab].label.toLowerCase()} bookings</h3>
            <p>
              {activeTab === 0
                ? 'Browse venues and make your first booking'
                : 'Your booking history will appear here'}
            </p>
            {activeTab === 0 && (
              <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/venues')}>
                Explore Venues
              </button>
            )}
          </div>
        ) : (
          filtered.map((b) => (
            <div key={b._id} className="booking-card">
              <div className="booking-card-header">
                <div>
                  <div className="booking-card-title">{b.resource?.name || 'Resource'}</div>
                  <div className="booking-card-venue">{b.venue?.name} · {b.venue?.location?.city}</div>
                </div>
                <span className={`status ${b.status}`}>{b.status}</span>
              </div>
              <div className="booking-card-meta">
                <span className="booking-card-time">🕐 {formatSlot(b.startTime, b.endTime)}</span>
                <span>👥 {b.guests} guest{b.guests > 1 ? 's' : ''}</span>
                {b.totalPrice > 0 && <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>₹{b.totalPrice}</span>}
              </div>
              <div className="booking-card-actions">
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button className="btn-danger" onClick={() => handleCancel(b._id)}>
                    Cancel
                  </button>
                )}
                <button className="btn-secondary" onClick={() => navigate(`/venues/${b.venue?._id}`)}>
                  View Venue
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default MyBookings