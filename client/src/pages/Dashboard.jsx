import { useEffect, useState } from 'react'
import { getAllVenues, getMyBookings } from '../api/booking.api'
import RoomCard from '../components/RoomCard'
import useAuth from '../hooks/useAuth'
import { formatSlot } from '../utils/formatSlot'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [rooms, setRooms] = useState([])
  const [myBookings, setMyBookings] = useState([])

  useEffect(() => {
    getAllVenues().then((res) => setRooms(res.data))
    getMyBookings().then((res) => setMyBookings(res.data))
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Bookd</h1>
        <div>
          <span>👋 {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section>
        <h2>Available Rooms</h2>
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </section>

      <section>
        <h2>My Bookings</h2>
        {myBookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="bookings-list">
            {myBookings.map((b) => (
              <li key={b._id}>
                <strong>{b.room?.name}</strong> —{' '}
                {formatSlot(b.startTime, b.endTime)}
                <span className={`status ${b.status}`}>{b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard