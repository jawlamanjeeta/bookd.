import { useNavigate } from 'react-router-dom'

const RoomCard = ({ room }) => {
  const navigate = useNavigate()

  return (
    <div className="room-card" onClick={() => navigate(`/booking/${room._id}`)}>
      <h3>{room.name}</h3>
      <p>📍 {room.location}</p>
      <p>👥 Capacity: {room.capacity}</p>
      {room.amenities?.length > 0 && (
        <p>✨ {room.amenities.join(', ')}</p>
      )}
      <button>Book Now</button>
    </div>
  )
}

export default RoomCard