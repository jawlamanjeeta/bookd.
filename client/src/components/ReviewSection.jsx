import { useEffect, useState } from 'react'
import { getVenueReviews, createReview, deleteReview } from '../api/advanced.api'
import useAuth from '../hooks/useAuth'

const Stars = ({ rating, onSelect }) => (
  <div style={{ display: 'flex', gap: '0.25rem' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        onClick={() => onSelect && onSelect(s)}
        style={{
          fontSize: '1.25rem', cursor: onSelect ? 'pointer' : 'default',
          color: s <= rating ? 'var(--amber)' : 'var(--border)',
          transition: 'color 0.15s',
        }}
      >★</span>
    ))}
  </div>
)

const ReviewSection = ({ venueId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ rating: 0, comment: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetch = () => {
    getVenueReviews(venueId).then((res) => setReviews(res.data)).catch(console.error)
  }

  useEffect(() => { fetch() }, [venueId])

  const handleSubmit = async () => {
    if (!form.rating) return setError('Please select a rating')
    setLoading(true); setError('')
    try {
      await createReview({ venueId, rating: form.rating, comment: form.comment })
      setForm({ rating: 0, comment: '' }); setShowForm(false)
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    await deleteReview(id)
    setReviews((prev) => prev.filter((r) => r._id !== id))
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div className="venue-section-title" style={{ margin: 0 }}>
            Reviews {avgRating && <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>★ {avgRating}</span>}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
        {user && !showForm && (
          <button className="btn-secondary" onClick={() => setShowForm(true)}>Write a Review</button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div className="form-label" style={{ marginBottom: '0.5rem' }}>Your Rating</div>
            <Stars rating={form.rating} onSelect={(r) => setForm({ ...form, rating: r })} />
          </div>
          <div className="form-group">
            <label className="form-label">Comment (optional)</label>
            <textarea
              rows="3" value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your experience..."
              style={{ resize: 'none' }}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-faint)', fontSize: '0.9rem' }}>
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reviews.map((r) => (
            <div key={r._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{r.user?.name}</div>
                  <Stars rating={r.rating} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  {user?._id === r.user?._id && (
                    <button className="btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--danger)', padding: '0.2rem 0.5rem' }} onClick={() => handleDelete(r._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {r.comment && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewSection