import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../api/portfolio.api'
import Navbar from '../components/Navbar'

const TYPE_ICONS = {
  restaurant: '🍽️', meeting_room: '🏢', sports_court: '🎾', study_room: '📚',
}

const VenueCard = ({ venue, onClick }) => (
  <div className="venue-card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className="venue-card-image">{TYPE_ICONS[venue.type] || '🏢'}</div>
    <div className="venue-card-body">
      <div className="venue-card-type">{venue.type?.replace('_', ' ')}</div>
      <div className="venue-card-name">{venue.name}</div>
      <div className="venue-card-location">📍 {venue.location?.address}, {venue.location?.city}</div>
      <div className="venue-card-footer">
        <div className="venue-rating">★ {venue.rating?.toFixed(1) || '4.5'}</div>
        <div className="venue-availability">Available</div>
      </div>
    </div>
  </div>
)

const SectionHeader = ({ eyebrow, title }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>{eyebrow}</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</h2>
  </div>
)

const Recommendations = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecommendations()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><div className="loading">Loading recommendations...</div></>

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Personalised</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Recommended For You
          </h1>
          {data?.preferredType && (
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Based on your preference for <span style={{ color: 'var(--accent)' }}>{data.preferredType.replace('_', ' ')}s</span>
            </p>
          )}
        </div>

        {/* Similar Venues */}
        {data?.similarVenues?.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader eyebrow="Tailored for you" title="Similar to What You've Booked" />
            <div className="venues-grid">
              {data.similarVenues.map((v) => (
                <VenueCard key={v._id} venue={v} onClick={() => navigate(`/venues/${v._id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* Popular Venues */}
        {data?.popularVenues?.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader eyebrow="Trending" title="Most Popular Right Now" />
            <div className="venues-grid">
              {data.popularVenues.map((v) => (
                <VenueCard key={v._id} venue={v} onClick={() => navigate(`/venues/${v._id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* Peak Slots */}
        {data?.peakSlots?.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader eyebrow="Smart Timing" title="Best Times to Book" />
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {data.peakSlots.map((slot, i) => (
                <div key={i} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '1.5rem 2rem',
                  textAlign: 'center', minWidth: 140,
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--amber)', marginBottom: '0.25rem' }}>
                    {slot.hour}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {slot.count} bookings
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--accent)' }}>
                    {i === 0 ? '🔥 Most Popular' : i === 1 ? '⚡ High Demand' : '✓ Good Time'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequent Resources */}
        {data?.frequentResources?.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeader eyebrow="Your Regulars" title="Spaces You Often Book" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.frequentResources.map((r) => (
                <div key={r._id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', flexWrap: 'wrap',
                }}
                  onClick={() => navigate(`/booking/${r._id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', flexWrap: 'wrap', cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', fontSize: '0.7rem' }}>{r.type}</span>
                      {r.venue && <span> · {r.venue.name}</span>}
                      <span> · 👥 {r.capacity}</span>
                    </div>
                  </div>
                  <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/booking/${r._id}`) }}>
                    Book Again
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data?.similarVenues?.length && !data?.popularVenues?.length && (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <h3>No recommendations yet</h3>
            <p>Make a few bookings and we'll personalise your recommendations</p>
            <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/venues')}>
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Recommendations