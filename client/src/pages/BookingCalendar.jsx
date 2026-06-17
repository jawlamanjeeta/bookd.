import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRoomBookings } from '../api/booking.api'
import BookingModal from '../components/BookingModal'
import useSocket from '../hooks/useSocket'
import { formatSlot } from '../utils/formatSlot'
import API from '../api/axios'

const BookingCalendar = () => {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [bookings, setBookings] = useState([])
  const [showModal, setShowModal] = useState(false)

  const fetchBookings = () => {
    getRoomBookings(roomId).then((res) => setBookings(res.data))
  }

  useEffect(() => {
    API.get(`/rooms/${roomId}`).then((res) => setRoom(res.data))
    fetchBookings()
  }, [roomId])

  useSocket(roomId, () => fetchBookings())

  if (!room) return <div className="loading">Loading room...</div>

  return (
    <div className="calendar-page">
      <h2>{room.name}</h2>
      <p>📍 {room.location} | 👥 {room.capacity}</p>

      <button className="book-btn" onClick={() => setShowModal(true)}>
        + New Booking
      </button>

      <h3>Current Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings for this room yet.</p>
      ) : (
        <ul className="bookings-list">
          {bookings.map((b) => (
            <li key={b._id}>
              <strong>{b.user?.name}</strong> —{' '}
              {formatSlot(b.startTime, b.endTime)}
              <span className={`status ${b.status}`}>{b.status}</span>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <BookingModal
          room={room}
          onClose={() => setShowModal(false)}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  )
}

export default BookingCalendar