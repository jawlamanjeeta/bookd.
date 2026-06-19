import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAllVenues } from '../api/booking.api'
import Navbar from '../components/Navbar'

const TYPES = [
  { label: 'All', value: '' },
  { label: '🍽️ Restaurant', value: 'restaurant' },
  { label: '🏢 Meeting Room', value: 'meeting_room' },
  { label: '🎾 Sports Court', value: 'sports_court' },
  { label: '📚 Study Room', value: 'study_room' },
]

const TYPE_ICONS = {
  restaurant: '🍽️',
  meeting_room: '🏢',
  sports_court: '🎾',
  study_room: '📚',
}

const Venues = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState(searchParams.get('type') || '')

  useEffect(() => {
    const params = {}
    if (activeType) params.type = activeType
    if (search) params.city = search

    getAllVenues(params)
      .then((res) => setVenues(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeType, search])

  return (
    <>
      <Navbar />
      <div className="venues-page">
        <div className="venues-header">
          <h1>Explore Venues</h1>
          <p>Find and book the perfect space for any occasion</p>
        </div>

        <div className="search-bar">
          <input
            placeholder="Search by city or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          {TYPES.map((t) => (
            <button
              key={t.value}
              className={`filter-chip ${activeType === t.value ? 'active' : ''}`}
              onClick={() => setActiveType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading" style={{ height: '300px' }}>Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏙️</div>
            <h3>No venues found</h3>
            <p>Try a different filter or check back later</p>
          </div>
        ) : (
          <div className="venues-grid">
            {venues.map((venue) => (
              <div key={venue._id} className="venue-card" onClick={() => navigate(`/venues/${venue._id}`)}>
                <div className="venue-card-image">{TYPE_ICONS[venue.type] || '🏢'}</div>
                <div className="venue-card-body">
                  <div className="venue-card-type">{venue.type?.replace('_', ' ')}</div>
                  <div className="venue-card-name">{venue.name}</div>
                  <div className="venue-card-location">📍 {venue.location?.address}, {venue.location?.city}</div>
                  <div className="venue-card-footer">
                    <div className="venue-rating">★ {venue.rating?.toFixed(1) || '4.5'} <span style={{ color: 'var(--text-faint)' }}>({venue.totalReviews || 0})</span></div>
                    <div className="venue-availability">Available</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Venues