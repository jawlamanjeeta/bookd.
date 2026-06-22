import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../api/advanced.api'
import Navbar from '../components/Navbar'

const TYPE_ICONS = {
  restaurant: '🍽️', meeting_room: '🏢', sports_court: '🎾', study_room: '📚',
}

const Favorites = () => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavorites()
      .then((res) => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (venueId) => {
    await removeFavorite(venueId)
    setFavorites((prev) => prev.filter((f) => f.venue._id !== venueId))
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Saved</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Favorites</h1>
        </div>

        {loading ? (
          <div className="loading" style={{ height: '200px' }}>Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Save venues you love to find them quickly</p>
            <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/venues')}>
              Explore Venues
            </button>
          </div>
        ) : (
          <div className="venues-grid">
            {favorites.map((f) => {
              const v = f.venue
              return (
                <div key={f._id} style={{ position: 'relative' }}>
                  <div className="venue-card" onClick={() => navigate(`/venues/${v._id}`)}>
                    <div className="venue-card-image">{TYPE_ICONS[v.type] || '🏢'}</div>
                    <div className="venue-card-body">
                      <div className="venue-card-type">{v.type?.replace('_', ' ')}</div>
                      <div className="venue-card-name">{v.name}</div>
                      <div className="venue-card-location">📍 {v.location?.address}, {v.location?.city}</div>
                      <div className="venue-card-footer">
                        <div className="venue-rating">★ {v.rating?.toFixed(1) || '4.5'}</div>
                        <div className="venue-availability">Available</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(v._id) }}
                    style={{
                      position: 'absolute', top: '0.75rem', right: '0.75rem',
                      background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                      borderRadius: '6px', color: 'var(--danger)', padding: '0.3rem 0.6rem', fontSize: '0.75rem',
                    }}
                  >
                    ♥ Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Favorites