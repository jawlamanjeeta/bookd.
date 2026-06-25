import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const COLORS = {
  bg: '#FDF8F2',
  bgAlt: '#FAF3E8',
  text: '#1C1410',
  textMuted: '#8C7B6E',
  textFaint: '#C4B5A8',
  accent: '#D4712A',
  accentLight: '#F5E6D3',
  gold: '#C9951A',
  rose: '#C45B4A',
  border: '#EDE4D8',
  cardBg: '#FFFFFF',
}

const VENUES = [
  { name: 'Nobu Tokyo', type: 'Restaurant', city: 'Tokyo', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240&h=240&fit=crop&q=80' },
  { name: 'WeWork NYC', type: 'Meeting Room', city: 'New York', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=240&h=240&fit=crop&q=80' },
  { name: 'Roland Garros', type: 'Sports Court', city: 'Paris', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=240&h=240&fit=crop&q=80' },
  { name: 'Bodleian Library', type: 'Study Room', city: 'Oxford', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=240&h=240&fit=crop&q=80' },
  { name: 'Sketch London', type: 'Restaurant', city: 'London', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=240&h=240&fit=crop&q=80' },
  { name: 'Google Campus', type: 'Meeting Room', city: 'SF', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=240&h=240&fit=crop&q=80' },
  { name: 'Wimbledon', type: 'Sports Court', city: 'London', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=240&h=240&fit=crop&q=80' },
  { name: 'Harvard Library', type: 'Study Room', city: 'Cambridge', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=240&h=240&fit=crop&q=80' },
  { name: 'Noma', type: 'Restaurant', city: 'Copenhagen', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=240&h=240&fit=crop&q=80' },
  { name: 'The Ned', type: 'Meeting Room', city: 'London', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=240&h=240&fit=crop&q=80' },
]

const TYPE_COLOR = {
  'Restaurant': COLORS.rose,
  'Meeting Room': COLORS.gold,
  'Sports Court': '#5A8A3C',
  'Study Room': COLORS.accent,
}

const faqs = [
  { q: 'How does real-time availability work?', a: 'When someone books a slot, all connected users instantly see it as unavailable — no page refresh needed.' },
  { q: 'What happens if I miss my booking window?', a: 'Unconfirmed bookings are automatically released after 15 minutes, freeing the slot for others.' },
  { q: 'Can I reschedule or cancel a booking?', a: 'Yes — cancel any upcoming booking from your My Bookings page.' },
  { q: 'Is there a fee to use bookd.?', a: 'bookd. is free for customers. Venue owners pay a small platform fee per successful booking.' },
]

const OrbitalRing = ({ venues, radiusX, radiusY, speed, cardW, cardH, offsetAngle = 0, navigate }) => {
  const angleRef = useRef(offsetAngle)
  const frameRef = useRef(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    const count = venues.length
    let angle = offsetAngle

    const tick = () => {
      angle += speed
      const positions = venues.map((v, i) => {
        const theta = angle + (i / count) * Math.PI * 2
        const x = Math.cos(theta) * radiusX
        const y = Math.sin(theta) * radiusY
        const scale = 0.75 + 0.25 * ((Math.sin(theta) + 1) / 2)
        const zIndex = Math.round(scale * 10)
        const opacity = 0.5 + 0.5 * ((Math.sin(theta) + 1) / 2)
        const tilt = Math.cos(theta) * 8
        return { ...v, x, y, scale, zIndex, opacity, tilt }
      })
      setCards(positions)
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
      {cards.map((c, i) => (
        <div
          key={i}
          onClick={() => navigate('/venues')}
          style={{
            position: 'absolute',
            width: cardW,
            left: c.x - cardW / 2,
            top: c.y - cardH / 2,
            zIndex: c.zIndex,
            opacity: c.opacity,
            transform: `scale(${c.scale}) rotate(${c.tilt}deg)`,
            cursor: 'pointer',
            transition: 'opacity 0.1s',
          }}
        >
          <div style={{
            background: COLORS.cardBg,
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 ${Math.round(c.scale * 8)}px ${Math.round(c.scale * 20)}px rgba(180,120,60,0.12)`,
          }}>
            <img
              src={c.img}
              alt={c.name}
              style={{ width: '100%', height: cardH * 0.65, objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
            <div style={{ padding: '0.6rem 0.75rem' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: TYPE_COLOR[c.type] || COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.type}</div>
              <div style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 1 }}>📍 {c.city}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const CARD_W = 150
  const CARD_H = 180

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', color: COLORS.text, fontFamily: 'Inter, sans-serif' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2rem',
        background: `rgba(253,248,242,0.9)`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px', color: COLORS.text }}>
          bookd<span style={{ color: COLORS.accent }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/venues')} style={{ background: 'transparent', border: 'none', color: COLORS.textMuted, fontSize: '0.875rem', cursor: 'pointer', padding: '0.5rem 1rem' }}>Explore</button>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: `1.5px solid ${COLORS.border}`, borderRadius: '999px', color: COLORS.text, fontSize: '0.875rem', cursor: 'pointer', padding: '0.5rem 1.25rem' }}>Login</button>
          <button
            onClick={() => navigate('/register')}
            style={{ background: COLORS.accent, border: 'none', borderRadius: '999px', color: '#fff', fontSize: '0.875rem', cursor: 'pointer', padding: '0.5rem 1.25rem', fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.background = '#B85E20'}
            onMouseLeave={(e) => e.target.style.background = COLORS.accent}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO — orbital */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4rem',
      }}>

        {/* Warm sunrise radial bg */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 60% at 50% 60%, rgba(212,113,42,0.06) 0%, rgba(201,149,26,0.04) 40%, transparent 70%)` }} />

        {/* Orbital rings */}
        <OrbitalRing
          venues={VENUES.slice(0, 6)}
          radiusX={380}
          radiusY={160}
          speed={0.003}
          cardW={CARD_W}
          cardH={CARD_H}
          offsetAngle={0}
          navigate={navigate}
        />
        <OrbitalRing
          venues={VENUES.slice(4, 10)}
          radiusX={270}
          radiusY={110}
          speed={-0.004}
          cardW={CARD_W - 20}
          cardH={CARD_H - 20}
          offsetAngle={Math.PI / 3}
          navigate={navigate}
        />

        {/* Center brand — sits on top */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 50 }}>
          {/* Warm glow behind text */}
          <div style={{ position: 'absolute', inset: '-40px', borderRadius: '50%', background: `radial-gradient(circle, rgba(253,248,242,0.95) 55%, rgba(253,248,242,0.7) 75%, transparent 100%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-4px',
              lineHeight: 1,
              color: COLORS.text,
              margin: 0,
            }}>
              bookd<span style={{ color: COLORS.accent }}>.</span>
            </h1>
            <p style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)', color: COLORS.textMuted, marginTop: '0.85rem', letterSpacing: '0.03em' }}>
              reserve any space — instantly, reliably.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/venues')}
                style={{ background: COLORS.text, color: '#fff', border: 'none', borderRadius: '999px', padding: '0.8rem 2rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = COLORS.accent}
                onMouseLeave={(e) => e.target.style.background = COLORS.text}
              >
                Explore Venues
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{ background: 'transparent', color: COLORS.textMuted, border: `1.5px solid ${COLORS.border}`, borderRadius: '999px', padding: '0.8rem 2rem', fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.target.style.borderColor = COLORS.accent; e.target.style.color = COLORS.accent }}
                onMouseLeave={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 50 }}>
          <div style={{ fontSize: '0.7rem', color: COLORS.textFaint, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>scroll</div>
          <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${COLORS.textFaint}, transparent)`, margin: '0 auto' }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: '3rem 2rem', background: COLORS.bgAlt }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {[
            { value: '500+', label: 'venues listed' },
            { value: '50K+', label: 'bookings made' },
            { value: '0', label: 'double bookings' },
            { value: '<200ms', label: 'sync speed' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: COLORS.text }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU CAN BOOK */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>what you can book</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: COLORS.text }}>
          every space, one platform.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[
            { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=220&fit=crop&q=80', name: 'Restaurants', desc: 'Reserve tables at top dining spots', type: 'restaurant' },
            { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=220&fit=crop&q=80', name: 'Meeting Rooms', desc: 'Professional spaces for your team', type: 'meeting_room' },
            { img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=220&fit=crop&q=80', name: 'Sports Courts', desc: 'Book courts for any sport', type: 'sports_court' },
            { img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=220&fit=crop&q=80', name: 'Study Rooms', desc: 'Quiet spaces to focus and learn', type: 'study_room' },
          ].map((v) => (
            <div
              key={v.type}
              onClick={() => navigate(`/venues?type=${v.type}`)}
              style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(180,120,60,0.06)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(180,120,60,0.14)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(180,120,60,0.06)' }}
            >
              <img src={v.img} alt={v.name} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1.1rem 1.25rem' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: COLORS.text, marginBottom: '0.25rem' }}>{v.name}</div>
                <div style={{ fontSize: '0.85rem', color: COLORS.textMuted }}>{v.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}`, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>how it works</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: COLORS.text }}>
            book in 3 steps.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {[
              { step: '01', title: 'Find a space', desc: 'Browse venues by type, location, and real-time availability.' },
              { step: '02', title: 'Pick your slot', desc: 'Select your date, time, and duration with instant conflict checking.' },
              { step: '03', title: 'Confirm & go', desc: 'Get your QR code and check in at the venue. Zero friction.' },
            ].map((s) => (
              <div key={s.step}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: COLORS.border, marginBottom: '1rem', letterSpacing: '-2px' }}>{s.step}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: COLORS.text }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: COLORS.textMuted, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '6rem 1.5rem', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>what people say</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: COLORS.text }}>
            trusted by thousands.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { text: 'bookd. saved us from double-booking nightmares. The real-time updates are incredible.', author: 'Priya S.', role: 'Office Manager' },
              { text: 'Found and booked a meeting room in under 2 minutes. This is how it should work.', author: 'Rahul M.', role: 'Startup Founder' },
              { text: 'Love that it suggests alternative slots when my preferred time is taken.', author: 'Aisha K.', role: 'Freelancer' },
            ].map((t, i) => (
              <div key={i} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '1.75rem', boxShadow: '0 2px 8px rgba(180,120,60,0.05)' }}>
                <div style={{ color: COLORS.gold, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>★★★★★</div>
                <p style={{ fontSize: '0.925rem', color: COLORS.textMuted, lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.25rem' }}>"{t.text}"</p>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: COLORS.text }}>{t.author}</div>
                <div style={{ fontSize: '0.8rem', color: COLORS.textFaint }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}`, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>faq</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-1px', marginBottom: '3rem', color: COLORS.text }}>
            common questions.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '1.1rem 1.4rem', background: 'transparent', color: COLORS.text, fontSize: '0.9rem', fontWeight: 500, fontFamily: 'Inter, sans-serif', textAlign: 'left', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {f.q}
                  <span style={{ color: COLORS.accent, fontSize: '1.25rem', flexShrink: 0, marginLeft: '1rem' }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.4rem 1.1rem', fontSize: '0.875rem', color: COLORS.textMuted, lineHeight: 1.75 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', borderTop: `1px solid ${COLORS.border}` }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '1rem', color: COLORS.text }}>
          ready to book?
        </h2>
        <p style={{ color: COLORS.textMuted, marginBottom: '2rem', fontSize: '1rem' }}>
          Join thousands who've simplified how they reserve spaces.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{ background: COLORS.accent, color: '#fff', border: 'none', borderRadius: '999px', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.target.style.background = '#B85E20'; e.target.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.target.style.background = COLORS.accent; e.target.style.transform = 'none' }}
        >
          Create Free Account →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: '2rem 1.5rem', textAlign: 'center', background: COLORS.bgAlt }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: COLORS.text, marginBottom: '0.5rem' }}>
          bookd<span style={{ color: COLORS.accent }}>.</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: COLORS.textFaint }}>© 2026 bookd. all rights reserved.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');
      `}</style>
    </div>
  )
}

export default Landing