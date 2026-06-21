import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { formatSlot } from '../utils/formatSlot'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const EVENT_CONFIG = {
  'new-booking': { icon: '📅', label: 'New Booking', color: 'var(--accent)' },
  'booking-confirmed': { icon: '✅', label: 'Confirmed', color: 'var(--success)' },
  'booking-cancelled': { icon: '❌', label: 'Cancelled', color: 'var(--danger)' },
  'no-show-release': { icon: '⏰', label: 'Auto Released', color: 'var(--warning)' },
}

const LiveFeed = ({ resourceIds = [] }) => {
  const [events, setEvents] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = io(SOCKET_URL)

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    // Join all resource rooms
    resourceIds.forEach((id) => socket.emit('join-room', id))

    socket.on('availability-updated', (data) => {
      const config = EVENT_CONFIG[data.type] || EVENT_CONFIG['new-booking']
      setEvents((prev) => [
        {
          id: Date.now(),
          type: data.type,
          bookingId: data.bookingId,
          roomId: data.roomId,
          timestamp: new Date(),
          ...config,
        },
        ...prev.slice(0, 19), // keep last 20
      ])
    })

    return () => socket.disconnect()
  }, [resourceIds.join(',')])

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.5rem',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Live Feed</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? 'var(--success)' : 'var(--danger)',
            boxShadow: connected ? '0 0 6px var(--success)' : 'none',
            animation: connected ? 'pulse 2s infinite' : 'none',
          }} />
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-faint)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📡</div>
          <div style={{ fontSize: '0.85rem' }}>Waiting for activity...</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            {connected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
          {events.map((e) => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
              padding: '0.75rem',
              background: 'var(--surface2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              animation: 'slideIn 0.3s ease',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{e.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: e.color }}>{e.label}</div>
                {e.bookingId && (
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', marginTop: '0.15rem' }}>
                    #{e.bookingId?.toString().slice(-8).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)', flexShrink: 0 }}>
                {e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default LiveFeed