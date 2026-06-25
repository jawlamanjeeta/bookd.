import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const VENUE_CARDS = [
  { emoji: '🍽️', name: 'The Grand Table', type: 'Restaurant', city: 'New Delhi', color: '#7C6EF8' },
  { emoji: '🏢', name: 'Nexus Hub', type: 'Meeting Room', city: 'Gurugram', color: '#F0A500' },
  { emoji: '🎾', name: 'Arena Sports Club', type: 'Sports Court', city: 'New Delhi', color: '#34D399' },
  { emoji: '📚', name: 'Zenith Study Lounge', type: 'Study Room', city: 'Pune', color: '#F87171' },
  { emoji: '🍽️', name: 'Spice Garden', type: 'Restaurant', city: 'Bangalore', color: '#7C6EF8' },
  { emoji: '🏢', name: 'WorkFlow Spaces', type: 'Meeting Room', city: 'Mumbai', color: '#F0A500' },
  { emoji: '🎾', name: 'PlayZone Courts', type: 'Sports Court', city: 'Bangalore', color: '#34D399' },
  { emoji: '📚', name: 'Focus Rooms', type: 'Study Room', city: 'Chennai', color: '#F87171' },
]

const DOUBLED = [...VENUE_CARDS, ...VENUE_CARDS]

const faqs = [
  { q: 'How does real-time availability work?', a: 'When someone books a slot, all connected users instantly see it as unavailable — no page refresh needed.' },
  { q: 'What happens if I miss my booking window?', a: 'Unconfirmed bookings are automatically released after 15 minutes, freeing the slot for others.' },
  { q: 'Can I reschedule or cancel a booking?', a: 'Yes, you can cancel any upcoming booking from your My Bookings page.' },
  { q: 'Is there a fee to use bookd.?', a: 'bookd. is free for customers. Venue owners pay a small platform fee per successful booking.' },
]

const Landing = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', color: '#F2F2F7' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 1.5rem 2rem',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,110,248,0.1) 0%, transparent 70%)',
        }} />

        {/* Brand name */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginBottom: '1.5rem' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(4rem, 14vw, 10rem)',
            fontWeight: 800,
            letterSpacing: '-4px',
            lineHeight: 1,
            color: '#F2F2F7',
            margin: 0,
          }}>
            bookd<span style={{ color: '#7C6EF8' }}>.</span>
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: '#8E8E9A',
            marginTop: '1rem',
            letterSpacing: '0.02em',
          }}>
            reserve any space. instantly. reliably.
          </p>
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '4rem', position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/venues')}
            style={{
              background: '#7C6EF8', color: '#fff',
              border: 'none', borderRadius: '999px',
              padding: '0.85rem 2rem', fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.background = '#5A4EE0'; e.target.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.target.style.background = '#7C6EF8'; e.target.style.transform = 'none' }}
          >
            Explore Venues
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'transparent', color: '#8E8E9A',
              border: '1.5px solid #2A2A35', borderRadius: '999px',
              padding: '0.85rem 2rem', fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = '#4A4A60'; e.target.style.color = '#F2F2F7' }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#2A2A35'; e.target.style.color = '#8E8E9A' }}
          >
            Get Started
          </button>
        </div>

        {/* Scrolling cards — Row 1 (left) */}
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: 2, marginBottom: '1rem' }}>
          <div style={{
            display: 'flex', gap: '1rem',
            animation: 'scrollLeft 30s linear infinite',
            width: 'max-content',
          }}>
            {DOUBLED.map((v, i) => (
              <VenueCard key={`r1-${i}`} v={v} onClick={() => navigate('/venues')} />
            ))}
          </div>
        </div>

        {/* Scrolling cards — Row 2 (right) */}
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'flex', gap: '1rem',
            animation: 'scrollRight 25s linear infinite',
            width: 'max-content',
          }}>
            {[...DOUBLED].reverse().map((v, i) => (
              <VenueCard key={`r2-${i}`} v={v} onClick={() => navigate('/venues')} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', zIndex: 2 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #2A2A35)', margin: '0 auto' }} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: '1px solid #2A2A35', borderBottom: '1px solid #2A2A35', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { value: '500+', label: 'venues listed' },
            { value: '50K+', label: 'bookings made' },
            { value: '0', label: 'double bookings' },
            { value: '<200ms', label: 'sync speed' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#F2F2F7' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: '#8E8E9A', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU CAN BOOK ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
          what you can book
        </div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem' }}>
          every space, one platform.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🍽️', name: 'Restaurants', desc: 'Reserve tables at top dining spots', type: 'restaurant' },
            { icon: '🏢', name: 'Meeting Rooms', desc: 'Professional spaces for your team', type: 'meeting_room' },
            { icon: '🎾', name: 'Sports Courts', desc: 'Book courts for any sport', type: 'sports_court' },
            { icon: '📚', name: 'Study Rooms', desc: 'Quiet spaces to focus and learn', type: 'study_room' },
          ].map((v) => (
            <div
              key={v.type}
              onClick={() => navigate(`/venues?type=${v.type}`)}
              style={{
                background: '#13131A', border: '1px solid #2A2A35',
                borderRadius: '14px', padding: '1.75rem 1.5rem',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C6EF8'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,110,248,0.12)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A2A35'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{v.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem' }}>{v.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#8E8E9A' }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderTop: '1px solid #2A2A35', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            how it works
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem' }}>
            book in 3 steps.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Find a space', desc: 'Browse venues by type, location, and availability in real time.' },
              { step: '02', title: 'Pick your slot', desc: 'Select your date, time, and duration. See instant availability.' },
              { step: '03', title: 'Confirm & go', desc: 'Get your QR code and check in at the venue. Zero friction.' },
            ].map((s) => (
              <div key={s.step}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 700, color: '#2A2A35', marginBottom: '1rem' }}>{s.step}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#8E8E9A', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ borderTop: '1px solid #2A2A35', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            what people say
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem' }}>
            trusted by thousands.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { text: 'bookd. saved us from double-booking nightmares. The real-time updates are incredible.', author: 'Priya S.', role: 'Office Manager' },
              { text: 'Found and booked a meeting room in under 2 minutes. This is how it should work.', author: 'Rahul M.', role: 'Startup Founder' },
              { text: 'Love that it suggests alternative slots when my preferred time is taken.', author: 'Aisha K.', role: 'Freelancer' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#13131A', border: '1px solid #2A2A35', borderRadius: '14px', padding: '1.75rem' }}>
                <div style={{ color: '#F0A500', marginBottom: '0.75rem', fontSize: '0.9rem' }}>★★★★★</div>
                <p style={{ fontSize: '0.95rem', color: '#8E8E9A', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.25rem' }}>"{t.text}"</p>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.author}</div>
                <div style={{ fontSize: '0.8rem', color: '#4A4A58' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ borderTop: '1px solid #2A2A35', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            faq
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem' }}>
            common questions.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: '#13131A', border: '1px solid #2A2A35', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '1.1rem 1.4rem',
                    background: 'transparent', color: '#F2F2F7',
                    fontSize: '0.95rem', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    textAlign: 'left', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  {f.q}
                  <span style={{ color: '#7C6EF8', fontSize: '1.2rem', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.4rem 1.1rem', fontSize: '0.9rem', color: '#8E8E9A', lineHeight: 1.7 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ borderTop: '1px solid #2A2A35', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1.5rem' }}>
          ready to book?
        </h2>
        <p style={{ color: '#8E8E9A', marginBottom: '2rem', fontSize: '1rem' }}>
          Join thousands who've simplified how they reserve spaces.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: '#7C6EF8', color: '#fff',
            border: 'none', borderRadius: '999px',
            padding: '1rem 2.5rem', fontSize: '1rem',
            fontFamily: 'Inter, sans-serif', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#5A4EE0'; e.target.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.target.style.background = '#7C6EF8'; e.target.style.transform = 'none' }}
        >
          Create Free Account →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #2A2A35', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          bookd<span style={{ color: '#7C6EF8' }}>.</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#4A4A58' }}>© 2026 bookd. all rights reserved.</p>
      </footer>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  )
}

const VenueCard = ({ v, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#13131A',
      border: '1px solid #2A2A35',
      borderRadius: '12px',
      padding: '1.25rem',
      width: '180px',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      userSelect: 'none',
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = v.color}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2A2A35'}
  >
    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{v.emoji}</div>
    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem', color: '#F2F2F7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
    <div style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: v.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{v.type}</div>
    <div style={{ fontSize: '0.72rem', color: '#4A4A58' }}>📍 {v.city}</div>
  </div>
)

export default Landing