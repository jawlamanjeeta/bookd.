import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookingQR, checkIn } from '../api/portfolio.api'
import { getBookingById } from '../api/booking.api'
import Navbar from '../components/Navbar'
import { formatSlot } from '../utils/formatSlot'

const QRCheckIn = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getBookingQR(bookingId)
      .then((res) => setQrData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load QR code'))
      .finally(() => setLoading(false))
  }, [bookingId])

  const handleCheckIn = async () => {
    setChecking(true)
    try {
      await checkIn(bookingId)
      setCheckedIn(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed')
    } finally { setChecking(false) }
  }

  if (loading) return <><Navbar /><div className="loading">Loading QR code...</div></>

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>QR Check-In</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Your Booking Pass</h1>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center' }}>
          {checkedIn ? (
            <div style={{ padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--success)' }}>
                Checked In!
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enjoy your booking. Have a great time!</p>
              <button className="btn-primary" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
            </div>
          ) : (
            <>
              {error ? (
                <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>
              ) : qrData?.qr ? (
                <>
                  {/* QR Code */}
                  <div style={{ background: '#13131A', borderRadius: 'var(--radius)', padding: '1rem', display: 'inline-block', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                    <img src={qrData.qr} alt="Booking QR Code" style={{ width: 220, height: 220, display: 'block' }} />
                  </div>

                  {/* Booking Details */}
                  {qrData.booking && (
                    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                          { label: 'Booking ID', value: `#${qrData.booking._id?.slice(-8).toUpperCase()}`, mono: true },
                          { label: 'Resource', value: qrData.booking.resource?.name },
                          { label: 'Venue', value: qrData.booking.venue?.name },
                          { label: 'Time', value: formatSlot(qrData.booking.startTime, qrData.booking.endTime), mono: true },
                          { label: 'Status', value: qrData.booking.status },
                        ].map((row) => (
                          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                            <span style={{ fontFamily: row.mono ? 'var(--font-mono)' : 'inherit', fontWeight: 500 }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                    Show this QR code at the venue for check-in
                  </p>

                  {qrData.booking?.status === 'confirmed' && (
                    <button className="btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={handleCheckIn} disabled={checking}>
                      {checking ? 'Checking in...' : '✓ Check In Now'}
                    </button>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📱</div>
                  <h3>QR not available</h3>
                  <p>Booking must be confirmed to generate a QR code</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default QRCheckIn