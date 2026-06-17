import { useState } from 'react'
import SlotPicker from './SlotPicker'
import ConflictAlert from './ConflictAlert'
import { createBooking, confirmBooking } from '../api/booking.api'

const BookingModal = ({ room, onClose, onSuccess }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingBooking, setPendingBooking] = useState(null)

  const handleChange = (field, value) => {
    if (field === 'startTime') setStartTime(value)
    if (field === 'endTime') setEndTime(value)
    setSuggestions([])
    setError('')
  }

  const handleSelectSuggestion = (slot) => {
    setStartTime(new Date(slot.startTime).toISOString().slice(0, 16))
    setEndTime(new Date(slot.endTime).toISOString().slice(0, 16))
    setSuggestions([])
  }

  const handleBook = async () => {
    if (!startTime || !endTime) return setError('Please select start and end time')
    if (new Date(startTime) >= new Date(endTime))
      return setError('End time must be after start time')

    setLoading(true)
    try {
      const res = await createBooking({ roomId: room._id, startTime, endTime })
      setPendingBooking(res.data)
    } catch (err) {
      if (err.response?.status === 409) {
        setSuggestions(err.response.data.suggestions || [])
        setError(err.response.data.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await confirmBooking(pendingBooking._id)
      onSuccess()
      onClose()
    } catch (err) {
      setError('Failed to confirm booking.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Book {room.name}</h2>
        <p>📍 {room.location} | 👥 {room.capacity}</p>

        {!pendingBooking ? (
          <>
            <SlotPicker
              startTime={startTime}
              endTime={endTime}
              onChange={handleChange}
            />
            {error && <p className="error">{error}</p>}
            <ConflictAlert
              suggestions={suggestions}
              onSelectSlot={handleSelectSuggestion}
            />
            <div className="modal-actions">
              <button onClick={onClose} disabled={loading}>Cancel</button>
              <button onClick={handleBook} disabled={loading}>
                {loading ? 'Checking...' : 'Book Slot'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>✅ Slot reserved! Confirm within 15 minutes or it will be released.</p>
            <div className="modal-actions">
              <button onClick={onClose} disabled={loading}>Cancel</button>
              <button onClick={handleConfirm} disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookingModal
