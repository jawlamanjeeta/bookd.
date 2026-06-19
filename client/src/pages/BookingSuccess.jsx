import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { formatSlot } from '../utils/formatSlot'

const BookingSuccess = () => {
  const { state } = useLocation()
  const booking = state?.booking
  const resource = state?.resource

  return (
    <>
      <Navbar />
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your reservation is confirmed. See you there!</p>

          {booking && (
            <div className="booking-details">
              <div className="booking-detail-row">
                <span>Booking ID</span>
                <span className="booking-id">#{booking._id?.slice(-8).toUpperCase()}</span>
              </div>
              {resource && (
                <div className="booking-detail-row">
                  <span>Space</span>
                  <span>{resource.name}</span>
                </div>
              )}
              <div className="booking-detail-row">
                <span>Time</span>
                <span>{formatSlot(booking.startTime, booking.endTime)}</span>
              </div>
              <div className="booking-detail-row">
                <span>Guests</span>
                <span>{booking.guests}</span>
              </div>
              {booking.totalPrice > 0 && (
                <div className="booking-detail-row">
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>₹{booking.totalPrice}</span>
                </div>
              )}
              <div className="booking-detail-row">
                <span>Status</span>
                <span className="status confirmed">confirmed</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/my-bookings" className="btn-secondary" style={{ flex: 1, textAlign: 'center', padding: '0.75rem' }}>
              My Bookings
            </Link>
            <Link to="/venues" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '0.75rem' }}>
              Book Another
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingSuccess