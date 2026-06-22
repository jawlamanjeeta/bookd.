import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFloorPlan, generateFloorPlan } from '../api/portfolio.api'
import { getVenueById } from '../api/booking.api'
import Navbar from '../components/Navbar'
import { io } from 'socket.io-client'
import useAuth from '../hooks/useAuth'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUS_COLORS = {
  available: { fill: 'rgba(52,211,153,0.15)', stroke: '#34D399', label: 'var(--success)' },
  booked: { fill: 'rgba(248,113,113,0.15)', stroke: '#F87171', label: 'var(--danger)' },
  occupied: { fill: 'rgba(251,191,36,0.15)', stroke: '#FBBF24', label: 'var(--warning)' },
}

const FloorPlan = () => {
  const { venueId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [hoveredSpot, setHoveredSpot] = useState(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 })
  const svgRef = useRef(null)

  const fetchPlan = () => {
    getFloorPlan(venueId)
      .then((res) => setPlan(res.data))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getVenueById(venueId).then((res) => setVenue(res.data)).catch(console.error)
    fetchPlan()

    const socket = io(SOCKET_URL)
    socket.emit('join-room', `floorplan-${venueId}`)
    socket.on('floorplan-updated', () => fetchPlan())
    socket.on('availability-updated', () => fetchPlan())

    return () => socket.disconnect()
  }, [venueId])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateFloorPlan(venueId)
      setPlan(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate floor plan')
    } finally { setGenerating(false) }
  }

  const handleSpotClick = (spot) => {
    if (spot.status === 'available' && spot.resource?._id) {
      navigate(`/booking/${spot.resource._id}`)
    }
  }

  const handleMouseMove = (e, spot) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltip({ x: e.clientX - rect.left + 10, y: e.clientY - rect.top - 40 })
    }
    setHoveredSpot(spot)
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Interactive</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {venue?.name || 'Floor Plan'}
            </h1>
          </div>
          {user?.role === 'admin' && (
            <button className="btn-secondary" onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : '⚡ Auto-Generate Layout'}
            </button>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {Object.entries(STATUS_COLORS).map(([status, colors]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: colors.fill, border: `2px solid ${colors.stroke}` }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontFamily: 'var(--font-mono)' }}>{status}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            Click a green spot to book
          </div>
        </div>

        {loading ? (
          <div className="loading" style={{ height: '400px' }}>Loading floor plan...</div>
        ) : !plan ? (
          <div className="empty-state" style={{ padding: '4rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div className="empty-state-icon">🏗️</div>
            <h3>No floor plan yet</h3>
            <p>Auto-generate a layout from your resources</p>
            {user?.role === 'admin' && (
              <button className="btn-primary" style={{ marginTop: '1.25rem' }} onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : 'Generate Floor Plan'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative' }}>
            <svg
              ref={svgRef}
              width="100%"
              viewBox={`0 0 ${plan.width} ${plan.height}`}
              style={{ display: 'block', cursor: 'default' }}
              onMouseLeave={() => setHoveredSpot(null)}
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(42,42,53,0.5)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width={plan.width} height={plan.height} fill="#0A0A0F" />
              <rect width={plan.width} height={plan.height} fill="url(#grid)" />

              {/* Spots */}
              {plan.spots.map((spot, i) => {
                const colors = STATUS_COLORS[spot.status] || STATUS_COLORS.available
                const isHovered = hoveredSpot?._id === spot._id || hoveredSpot?.label === spot.label
                const isClickable = spot.status === 'available'

                return (
                  <g
                    key={i}
                    style={{ cursor: isClickable ? 'pointer' : 'default' }}
                    onClick={() => handleSpotClick(spot)}
                    onMouseMove={(e) => handleMouseMove(e, spot)}
                    onMouseLeave={() => setHoveredSpot(null)}
                  >
                    {/* Glow effect on hover */}
                    {isHovered && isClickable && (
                      <rect
                        x={spot.x - 4} y={spot.y - 4}
                        width={spot.width + 8} height={spot.height + 8}
                        rx="10" fill="none"
                        stroke={colors.stroke} strokeWidth="1.5"
                        opacity="0.4"
                        style={{ filter: 'blur(4px)' }}
                      />
                    )}
                    {/* Main spot */}
                    <rect
                      x={spot.x} y={spot.y}
                      width={spot.width} height={spot.height}
                      rx="8"
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isHovered ? 2 : 1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Label */}
                    <text
                      x={spot.x + spot.width / 2}
                      y={spot.y + spot.height / 2 - 6}
                      textAnchor="middle"
                      fill={colors.stroke}
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="500"
                    >
                      {spot.label.length > 14 ? spot.label.slice(0, 12) + '…' : spot.label}
                    </text>
                    {/* Status */}
                    <text
                      x={spot.x + spot.width / 2}
                      y={spot.y + spot.height / 2 + 10}
                      textAnchor="middle"
                      fill={colors.stroke}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      opacity="0.7"
                      textTransform="uppercase"
                    >
                      {spot.status}
                    </text>
                    {/* Capacity */}
                    {spot.resource?.capacity && (
                      <text
                        x={spot.x + spot.width - 8}
                        y={spot.y + 14}
                        textAnchor="end"
                        fill={colors.stroke}
                        fontSize="8"
                        fontFamily="JetBrains Mono, monospace"
                        opacity="0.5"
                      >
                        {spot.resource.capacity}p
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Tooltip */}
            {hoveredSpot && (
              <div style={{
                position: 'absolute',
                left: tooltip.x, top: tooltip.y,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                pointerEvents: 'none',
                zIndex: 10,
                whiteSpace: 'nowrap',
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>{hoveredSpot.label}</div>
                <div style={{ color: STATUS_COLORS[hoveredSpot.status]?.stroke }}>{hoveredSpot.status}</div>
                {hoveredSpot.resource?.capacity && (
                  <div style={{ color: 'var(--text-faint)' }}>Capacity: {hoveredSpot.resource.capacity}</div>
                )}
                {hoveredSpot.status === 'available' && (
                  <div style={{ color: 'var(--accent)', marginTop: '0.2rem' }}>Click to book →</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default FloorPlan