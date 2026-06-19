import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const venueTypes = [
  { icon: '🍽️', name: 'Restaurants', desc: 'Reserve tables at top dining spots', type: 'restaurant' },
  { icon: '🏢', name: 'Meeting Rooms', desc: 'Professional spaces for your team', type: 'meeting_room' },
  { icon: '🎾', name: 'Sports Courts', desc: 'Book courts for any sport', type: 'sports_court' },
  { icon: '📚', name: 'Study Rooms', desc: 'Quiet spaces to focus and learn', type: 'study_room' },
]

const testimonials = [
  { text: 'Bookd saved us from double-booking nightmares. The real-time updates are incredible.', author: 'Priya S.', role: 'Office Manager', stars: 5 },
  { text: 'Found and booked a meeting room in under 2 minutes. This is how it should work.', author: 'Rahul M.', role: 'Startup Founder', stars: 5 },
  { text: 'Love that it suggests alternative slots when my preferred time is taken.', author: 'Aisha K.', role: 'Freelancer', stars: 5 },
]

const faqs = [
  { q: 'How does real-time availability work?', a: 'When someone books a slot, all connected users instantly see that slot as unavailable — no page refresh needed.' },
  { q: 'What happens if I miss my booking window?', a: 'Unconfirmed bookings are automatically released after 15 minutes, freeing the slot for others to book.' },
  { q: 'Can I reschedule or cancel a booking?', a: 'Yes, you can cancel any upcoming booking from your My Bookings page. Rescheduling creates a new booking.' },
  { q: 'Is there a fee to use Bookd?', a: 'Bookd is free for customers. Venue owners pay a small platform fee per successful booking.' },
]

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="hero-eyebrow">Zero double-bookings. Ever.</span>
          <h1 className="hero-title">
            Book any space.<br />
            <span className="accent">Instantly.</span>{' '}
            <span className="amber">Reliably.</span>
          </h1>
          <p className="hero-subtitle">
            Bookd uses atomic conflict resolution to guarantee your reservation — restaurants, meeting rooms, courts, and more.
          </p>
          <div className="hero-cta">
            <Link to="/venues" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              Explore Venues
            </Link>
            <Link to="/register" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              Create Account
            </Link>
          </div>
          <div className="hero-stats">
            {[
              { value: '500+', label: 'Venues Listed' },
              { value: '50K+', label: 'Bookings Made' },
              { value: '0', label: 'Double Bookings' },
              { value: '<200ms', label: 'Sync Speed' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Venue Types */}
      <div className="section">
        <div className="section-eyebrow">What you can book</div>
        <h2 className="section-title">Every space, one platform</h2>
        <p className="section-subtitle">From a dinner table to a basketball court — find and book any venue in seconds.</p>
        <div className="venue-types-grid">
          {venueTypes.map((v) => (
            <Link to={`/venues?type=${v.type}`} key={v.type} style={{ textDecoration: 'none' }}>
              <div className="venue-type-card">
                <div className="venue-type-icon">{v.icon}</div>
                <div className="venue-type-name">{v.name}</div>
                <div className="venue-type-desc">{v.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Testimonials */}
      <div className="section">
        <div className="section-eyebrow">What people say</div>
        <h2 className="section-title">Trusted by thousands</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* FAQ */}
      <div className="section">
        <div className="section-eyebrow">FAQ</div>
        <h2 className="section-title">Common questions</h2>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Bookd</div>
        <p>© 2026 Bookd. Built with atomic precision.</p>
      </footer>
    </div>
  )
}

export default Landing