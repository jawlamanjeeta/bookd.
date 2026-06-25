import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Real Unsplash images — free to use, no attribution required
const VENUE_CARDS = [
  {
    name: 'Nobu Tokyo',
    type: 'Restaurant',
    city: 'Tokyo, Japan',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop',
    color: '#7C6EF8',
  },
  {
    name: 'The Ned London',
    type: 'Meeting Room',
    city: 'London, UK',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop',
    color: '#F0A500',
  },
  {
    name: 'Roland Garros Courts',
    type: 'Sports Court',
    city: 'Paris, France',
    img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=300&fit=crop',
    color: '#34D399',
  },
  {
    name: 'New York Public Library',
    type: 'Study Room',
    city: 'New York, USA',
    img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=300&fit=crop',
    color: '#F87171',
  },
  {
    name: 'Sketch Restaurant',
    type: 'Restaurant',
    city: 'London, UK',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop',
    color: '#7C6EF8',
  },
  {
    name: 'WeWork Headquarters',
    type: 'Meeting Room',
    city: 'New York, USA',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&h=300&fit=crop',
    color: '#F0A500',
  },
  {
    name: 'Dubai Sports City',
    type: 'Sports Court',
    city: 'Dubai, UAE',
    img: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=300&fit=crop',
    color: '#34D399',
  },
  {
    name: 'Oxford Bodleian Library',
    type: 'Study Room',
    city: 'Oxford, UK',
    img: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&h=300&fit=crop',
    color: '#F87171',
  },
  {
    name: 'Noma Copenhagen',
    type: 'Restaurant',
    city: 'Copenhagen, Denmark',
    img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=300&fit=crop',
    color: '#7C6EF8',
  },
  {
    name: 'Google Campus',
    type: 'Meeting Room',
    city: 'San Francisco, USA',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=300&fit=crop',
    color: '#F0A500',
  },
  {
    name: 'Wimbledon Courts',
    type: 'Sports Court',
    city: 'London, UK',
    img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=300&fit=crop',
    color: '#34D399',
  },
  {
    name: 'Harvard Study Hall',
    type: 'Study Room',
    city: 'Cambridge, USA',
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=300&fit=crop',
    color: '#F87171',
  },
]

const DOUBLED = [...VENUE_CARDS, ...VENUE_CARDS]
const DOUBLED_REV = [...VENUE_CARDS].reverse()
const DOUBLED_REV2 = [...DOUBLED_REV, ...DOUBLED_REV]

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
    <div style={{ background: '#F5F4F0', minHeight: '100vh', color: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        background: 'rgba(245,244,240,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          bookd<span style={{ color: '#7C6EF8' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/venues')} style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.9rem', cursor: 'pointer', padding: '0.5rem 1rem' }}>Explore</button>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1.5px solid #ddd', borderRadius: '999px', color: '#333', fontSize: '0.9rem', cursor: 'pointer', padding: '0.5rem 1.25rem' }}>Login</button>
          <button onClick={() => navigate('/register')} style={{ background: '#1A1A1A', border: 'none', borderRadius: '999px', color: '#fff', fontSize: '0.9rem', cursor: 'pointer', padding: '0.5rem 1.25rem', fontWeight: 600 }}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '5rem',
      }}>

        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(124,110,248,0.07) 0%, transparent 70%)',
        }} />

        {/* Brand */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginBottom: '0.75rem' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(5rem, 16vw, 12rem)',
            fontWeight: 800,
            letterSpacing: '-6px',
            lineHeight: 1,
            color: '#1A1A1A',
            margin: 0,
          }}>
            bookd<span style={{ color: '#7C6EF8' }}>.</span>
          </h1>
          <p style={{
            fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
            color: '#888',
            marginTop: '0.85rem',
            letterSpacing: '0.04em',
            fontWeight: 400,
          }}>
            reserve any space — instantly, reliably, beautifully.
          </p>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3.5rem', position: 'relative', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/venues')}
            style={{ background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.85rem 2rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.background = '#333'}
            onMouseLeave={(e) => e.target.style.background = '#1A1A1A'}
          >
            Explore Venues
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{ background: 'transparent', color: '#555', border: '1.5px solid #ccc', borderRadius: '999px', padding: '0.85rem 2rem', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.borderColor = '#999'; e.target.style.color = '#1A1A1A' }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#ccc'; e.target.style.color = '#555' }}
          >
            Create Account
          </button>
        </div>

        {/* ── SCROLLING IMAGE ROWS ── */}
        <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>

          {/* Row 1 — scrolls left */}
          <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{
              display: 'flex', gap: '1rem',
              animation: 'scrollLeft 40s linear infinite',
              width: 'max-content',
            }}>
              {DOUBLED.map((v, i) => (
                <VenueCard key={`r1-${i}`} v={v} onClick={() => navigate('/venues')} />
              ))}
            </div>
          </div>

          {/* Row 2 — scrolls right */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex', gap: '1rem',
              animation: 'scrollRight 35s linear infinite',
              width: 'max-content',
            }}>
              {DOUBLED_REV2.map((v, i) => (
                <VenueCard key={`r2-${i}`} v={v} onClick={() => navigate('/venues')} />
              ))}
            </div>
          </div>
        </div>

        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to right, #F5F4F0, transparent)', pointerEvents: 'none', zIndex: 3 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to left, #F5F4F0, transparent)', pointerEvents: 'none', zIndex: 3 }} />
      </section>

      {/* ── STATS ── */}
      <section style={{ borderTop: '1px solid #E8E7E3', borderBottom: '1px solid #E8E7E3', padding: '3rem 2rem', background: '#EFEDE8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { value: '500+', label: 'venues listed' },
            { value: '50K+', label: 'bookings made' },
            { value: '0', label: 'double bookings' },
            { value: '<200ms', label: 'sync speed' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#1A1A1A' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU CAN BOOK ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>what you can book</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: '#1A1A1A' }}>
          every space, one platform.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=220&fit=crop', name: 'Restaurants', desc: 'Reserve tables at top dining spots', type: 'restaurant' },
            { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=220&fit=crop', name: 'Meeting Rooms', desc: 'Professional spaces for your team', type: 'meeting_room' },
            { img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=220&fit=crop', name: 'Sports Courts', desc: 'Book courts for any sport', type: 'sports_court' },
            { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=220&fit=crop', name: 'Study Rooms', desc: 'Quiet spaces to focus and learn', type: 'study_room' },
          ].map((v) => (
            <div
              key={v.type}
              onClick={() => navigate(`/venues?type=${v.type}`)}
              style={{ background: '#fff', border: '1px solid #E8E7E3', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <img src={v.img} alt={v.name} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.3rem', color: '#1A1A1A' }}>{v.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#EFEDE8', borderTop: '1px solid #E8E7E3', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>how it works</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: '#1A1A1A' }}>
            book in 3 steps.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {[
              { step: '01', title: 'Find a space', desc: 'Browse venues by type, location, and real-time availability.' },
              { step: '02', title: 'Pick your slot', desc: 'Select your date, time, and duration with instant conflict checking.' },
              { step: '03', title: 'Confirm & go', desc: 'Get your QR code and check in at the venue. Zero friction.' },
            ].map((s) => (
              <div key={s.step}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: '#D5D2CB', marginBottom: '1rem', letterSpacing: '-2px' }}>{s.step}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1A1A1A' }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#888', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '6rem 1.5rem', borderTop: '1px solid #E8E7E3' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>what people say</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: '#1A1A1A' }}>
            trusted by thousands.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { text: 'bookd. saved us from double-booking nightmares. The real-time updates are incredible.', author: 'Priya S.', role: 'Office Manager' },
              { text: 'Found and booked a meeting room in under 2 minutes. This is how it should work.', author: 'Rahul M.', role: 'Startup Founder' },
              { text: 'Love that it suggests alternative slots when my preferred time is taken.', author: 'Aisha K.', role: 'Freelancer' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E8E7E3', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ color: '#F0A500', marginBottom: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>★★★★★</div>
                <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.25rem' }}>"{t.text}"</p>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A1A' }}>{t.author}</div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#EFEDE8', borderTop: '1px solid #E8E7E3', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7C6EF8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>faq</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: '#1A1A1A' }}>
            common questions.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E8E7E3', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '1.1rem 1.4rem', background: 'transparent', color: '#1A1A1A', fontSize: '0.925rem', fontWeight: 500, fontFamily: 'Inter, sans-serif', textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {f.q}
                  <span style={{ color: '#7C6EF8', fontSize: '1.2rem', flexShrink: 0, marginLeft: '1rem' }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.4rem 1.1rem', fontSize: '0.875rem', color: '#777', lineHeight: 1.75 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', borderTop: '1px solid #E8E7E3' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem', color: '#1A1A1A' }}>
          ready to book?
        </h2>
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1rem' }}>
          Join thousands who've simplified how they reserve spaces.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{ background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '999px', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.target.style.background = '#7C6EF8'; e.target.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.target.style.background = '#1A1A1A'; e.target.style.transform = 'none' }}
        >
          Create Free Account →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #E8E7E3', padding: '2rem 1.5rem', textAlign: 'center', background: '#EFEDE8' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1A1A1A' }}>
          bookd<span style={{ color: '#7C6EF8' }}>.</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2026 bookd. all rights reserved.</p>
      </footer>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

const VenueCard = ({ v, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: 200,
      flexShrink: 0,
      borderRadius: '14px',
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid #E8E7E3',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.2s',
      userSelect: 'none',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)' }}
  >
    <img
      src={v.img}
      alt={v.name}
      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
      loading="lazy"
    />
    <div style={{ padding: '0.85rem' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
      <div style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: v.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>{v.type}</div>
      <div style={{ fontSize: '0.68rem', color: '#aaa' }}>📍 {v.city}</div>
    </div>
  </div>
)

export default Landing