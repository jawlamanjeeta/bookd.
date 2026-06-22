import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVenueById, getResourcesByVenue } from '../api/booking.api'
import Navbar from '../components/Navbar'
import useAuth from '../hooks/useAuth'
import ReviewSection from '../components/ReviewSection'
import { addFavorite, removeFavorite, checkFavorite } from '../api/advanced.api'

const TYPE_ICONS = {
  restaurant: '🍽️', meeting_room: '🏢', sports_court: '🎾', study_room: '📚',
}

const VenueDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [venue, setVenue] = useState(null)
  const [resources, setResources] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    Promise.all([getVenueById(id), getResourcesByVenue(id)])
      .then(([vRes, rRes]) => { setVenue(vRes.data); setResources(rRes.data) })
      .catch(console.error)
      .finally(() => setLoading(false))

    if (user) {
      checkFavorite(id).then((res) => setIsFavorite(res.data.isFavorite)).catch(console.error)
    }
  }, [id])

  const handleBook = () => {
    if (!user) return navigate('/login')
    if (!selected) return alert('Please select a resource to book')
    navigate(`/booking/${selected._id}`)
  }

  const handleFavorite = async () => {
    if (!user) return navigate('/login')
    try {
      if (isFavorite) { await removeFavorite(id); setIsFavorite(false) }
      else { await addFavorite(id); setIsFavorite(true) }
    } catch (err) { console.error(err) }
  }

  if (loading) return <><Navbar /><div className="loading">Loading venue...</div></>
  if (!venue) return <><Navbar /><div className="loading">Venue not found</div></>

  return (
    <>
      <Navbar />
      <div className="venue-detail">
        <div className="venue-detail-hero">{TYPE_ICONS[venue.type] || '🏢'}</div>

        <div className="venue-detail-header">
          <div>
            <div className="venue-detail-type">{venue.type?.replace('_', ' ')}</div>
            <div className="venue-detail-name">{venue.name}</div>
            <div className="venue-detail-meta">
              <span className="venue-meta-item">📍 {venue.location?.address}, {venue.location?.city}</span>
              <span className="venue-meta-item">⏰ {venue.openingHours?.open} – {venue.openingHours?.close}</span>
              <span className="venue-meta-item">★ {venue.rating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleFavorite}
              style={{
                background: isFavorite ? 'rgba(240,165,0,0.1)' : 'transparent',
                border: `1.5px solid ${isFavorite ? 'var(--amber)' : 'var(--border)'}`,
                color: isFavorite ? 'var(--amber)' : 'var(--text-muted)',
                padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)',
              }}
            >
              {isFavorite ? '♥ Saved' : '♡ Save'}
            </button>
            <button className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={handleBook}>
              Book Now
            </button>
          </div>
        </div>

        {venue.description && (
          <p className="venue-detail-desc">{venue.description}</p>
        )}

        {venue.rules?.length > 0 && (
          <>
            <div className="venue-section-title">Rules & Guidelines</div>
            <ul className="rules-list">
              {venue.rules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </>
        )}

        <div className="venue-section-title">Select a Space</div>
        {resources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🪑</div>
            <h3>No resources available</h3>
            <p>This venue hasn't added any bookable spaces yet</p>
          </div>
        ) : (
          <div className="resources-grid">
            {resources.map((r) => (
              <div
                key={r._id}
                className={`resource-card ${selected?._id === r._id ? 'selected' : ''}`}
                onClick={() => setSelected(r)}
              >
                <div className="resource-name">{r.name}</div>
                <div className="resource-meta">👥 Up to {r.capacity} guests</div>
                {r.amenities?.length > 0 && (
                  <div className="resource-meta" style={{ marginTop: '0.3rem' }}>✨ {r.amenities.join(', ')}</div>
                )}
                <div className="resource-price">₹{r.pricePerHour}/hr</div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button className="btn-primary" style={{ padding: '0.85rem 2rem' }} onClick={handleBook}>
              Book {selected.name} →
            </button>
          </div>
        )}

        <ReviewSection venueId={id} />
      </div>
    </>
  )
}

export default VenueDetail
