import { useEffect, useState } from 'react'
import { getOwnerReservations, updateReservationStatus } from '../api/dashboard.api'
import Navbar from '../components/Navbar'
import { formatSlot } from '../utils/formatSlot'

const TABS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const ReservationManagement = () => {
  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)

  const fetchBookings = (status) => {
    setLoading(true)
    getOwnerReservations({ status })
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings(activeTab) }, [activeTab])

  const handleStatus = async (id, status) => {
    try {
      await updateReservationStatus(id, status)
      fetchBookings(activeTab)
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Owner Dashboard</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Reservations</h1>
        </div>

        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              className={`tab ${activeTab === t.value ? 'active' : ''}`}
              onClick={() => setActiveTab(t.value)}
            >{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading" style={{ height: '200px' }}>Loading reservations...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No {activeTab} reservations</h3>
            <p>Reservations will appear here as customers book your resources</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map((b) => (
              <div key={b._id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{b.resource?.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      👤 {b.user?.name} · {b.user?.email}
                    </div>
                  </div>
                  <span className={`status ${b.status}`}>{b.status}</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    🕐 {formatSlot(b.startTime, b.endTime)}
                  </span>
                  <span>👥 {b.guests} guest{b.guests > 1 ? 's' : ''}</span>
                  {b.totalPrice > 0 && (
                    <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>₹{b.totalPrice}</span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    #{b._id?.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {b.status === 'pending' && (
                    <>
                      <button className="btn-primary" onClick={() => handleStatus(b._id, 'confirmed')}>
                        ✓ Approve
                      </button>
                      <button className="btn-danger" onClick={() => handleStatus(b._id, 'cancelled')}>
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <>
                      <button className="btn-secondary" onClick={() => handleStatus(b._id, 'completed')}>
                        Mark Completed
                      </button>
                      <button className="btn-danger" onClick={() => handleStatus(b._id, 'cancelled')}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ReservationManagement