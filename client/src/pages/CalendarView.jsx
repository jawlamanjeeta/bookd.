import { useEffect, useState } from 'react'
import { getCalendarBookings } from '../api/advanced.api'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

const VIEWS = ['Day', 'Week', 'Month']
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7am - 10pm

const formatDate = (d) => d.toISOString().split('T')[0]

const CalendarView = () => {
  const navigate = useNavigate()
  const [view, setView] = useState('Week')
  const [current, setCurrent] = useState(new Date())
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const getRange = () => {
    const start = new Date(current)
    const end = new Date(current)
    if (view === 'Day') { start.setHours(0,0,0,0); end.setHours(23,59,59,999) }
    else if (view === 'Week') {
      const day = start.getDay()
      start.setDate(start.getDate() - day); start.setHours(0,0,0,0)
      end.setDate(start.getDate() + 6); end.setHours(23,59,59,999)
    } else {
      start.setDate(1); start.setHours(0,0,0,0)
      end.setMonth(end.getMonth() + 1); end.setDate(0); end.setHours(23,59,59,999)
    }
    return { start, end }
  }

  useEffect(() => {
    const { start, end } = getRange()
    setLoading(true)
    getCalendarBookings({ start: start.toISOString(), end: end.toISOString() })
      .then((res) => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [view, current])

  const navigate_ = (dir) => {
    const d = new Date(current)
    if (view === 'Day') d.setDate(d.getDate() + dir)
    else if (view === 'Week') d.setDate(d.getDate() + dir * 7)
    else d.setMonth(d.getMonth() + dir)
    setCurrent(d)
  }

  const getWeekDays = () => {
    const start = new Date(current)
    start.setDate(start.getDate() - start.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d
    })
  }

  const getBookingsForSlot = (date, hour) => {
    return bookings.filter((b) => {
      const s = new Date(b.startTime)
      return formatDate(s) === formatDate(date) && s.getHours() === hour
    })
  }

  const getMonthDays = () => {
    const year = current.getFullYear(), month = current.getMonth()
    const first = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < first; i++) cells.push(null)
    for (let i = 1; i <= days; i++) cells.push(new Date(year, month, i))
    return cells
  }

  const headerLabel = () => {
    if (view === 'Day') return current.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    if (view === 'Week') {
      const days = getWeekDays()
      return `${days[0].toLocaleDateString('en', { month: 'short', day: 'numeric' })} — ${days[6].toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return current.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  }

  const slotStyle = {
    fontSize: '0.7rem', padding: '0.2rem 0.4rem',
    background: 'var(--accent-glow)', border: '1px solid rgba(124,110,248,0.3)',
    borderRadius: '4px', color: 'var(--accent)', cursor: 'pointer',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    marginBottom: '2px',
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Schedule</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Calendar</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tabs" style={{ margin: 0 }}>
              {VIEWS.map((v) => (
                <button key={v} className={`tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>{v}</button>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => navigate_(-1)}>←</button>
            <button className="btn-ghost" onClick={() => setCurrent(new Date())} style={{ fontSize: '0.8rem' }}>Today</button>
            <button className="btn-secondary" onClick={() => navigate_(1)}>→</button>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
          {headerLabel()}
        </div>

        {loading ? (
          <div className="loading" style={{ height: '300px' }}>Loading calendar...</div>
        ) : (
          <>
            {/* Day View */}
            {view === 'Day' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {HOURS.map((hour) => {
                  const slots = getBookingsForSlot(current, hour)
                  return (
                    <div key={hour} style={{ display: 'flex', borderBottom: '1px solid var(--border)', minHeight: 60 }}>
                      <div style={{ width: 60, padding: '0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', flexShrink: 0, borderRight: '1px solid var(--border)' }}>
                        {hour}:00
                      </div>
                      <div style={{ flex: 1, padding: '0.4rem 0.75rem' }}>
                        {slots.map((b) => (
                          <div key={b._id} style={slotStyle} onClick={() => navigate(`/venues/${b.venue?._id}`)}>
                            {b.resource?.name} · {b.user?.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Week View */}
            {view === 'Week' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ borderRight: '1px solid var(--border)' }} />
                  {getWeekDays().map((d, i) => {
                    const isToday = formatDate(d) === formatDate(new Date())
                    return (
                      <div key={i} style={{ padding: '0.75rem 0.5rem', textAlign: 'center', borderRight: i < 6 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {d.toLocaleDateString('en', { weekday: 'short' })}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--text)', marginTop: '0.2rem' }}>
                          {d.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Hours */}
                {HOURS.map((hour) => (
                  <div key={hour} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--border)', minHeight: 52 }}>
                    <div style={{ padding: '0.4rem', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start' }}>
                      {hour}:00
                    </div>
                    {getWeekDays().map((d, i) => {
                      const slots = getBookingsForSlot(d, hour)
                      return (
                        <div key={i} style={{ padding: '0.3rem', borderRight: i < 6 ? '1px solid var(--border)' : 'none', minHeight: 52 }}>
                          {slots.map((b) => (
                            <div key={b._id} style={slotStyle} onClick={() => navigate(`/venues/${b.venue?._id}`)}>
                              {b.resource?.name}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Month View */}
            {view === 'Month' && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                    <div key={d} style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderRight: '1px solid var(--border)' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {getMonthDays().map((d, i) => {
                    const isToday = d && formatDate(d) === formatDate(new Date())
                    const dayBookings = d ? bookings.filter((b) => formatDate(new Date(b.startTime)) === formatDate(d)) : []
                    return (
                      <div key={i} style={{ minHeight: 90, padding: '0.5rem', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: isToday ? 'var(--accent-glow)' : 'transparent' }}>
                        {d && (
                          <>
                            <div style={{ fontSize: '0.8rem', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '0.3rem' }}>{d.getDate()}</div>
                            {dayBookings.slice(0, 2).map((b) => (
                              <div key={b._id} style={slotStyle}>{b.resource?.name}</div>
                            ))}
                            {dayBookings.length > 2 && (
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>+{dayBookings.length - 2} more</div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CalendarView