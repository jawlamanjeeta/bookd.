import { useEffect, useState } from 'react'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/advanced.api'
import Navbar from '../components/Navbar'

const TYPE_CONFIG = {
  booking_confirmed: { icon: '✅', color: 'var(--success)' },
  booking_cancelled: { icon: '❌', color: 'var(--danger)' },
  resource_available: { icon: '🔔', color: 'var(--accent)' },
  waitlist_notified: { icon: '⏳', color: 'var(--warning)' },
  review_received: { icon: '⭐', color: 'var(--amber)' },
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleRead = async (id) => {
    await markAsRead(id)
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n))
  }

  const handleReadAll = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = async (id) => {
    await deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n._id !== id))
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Inbox</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Notifications {unread > 0 && <span style={{ fontSize: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>({unread})</span>}
            </h1>
          </div>
          {unread > 0 && (
            <button className="btn-secondary" onClick={handleReadAll}>Mark all as read</button>
          )}
        </div>

        {loading ? (
          <div className="loading" style={{ height: '200px' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3>No notifications yet</h3>
            <p>We'll notify you about booking updates and waitlist availability</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || { icon: '📬', color: 'var(--text-muted)' }
              return (
                <div key={n._id} style={{
                  background: n.read ? 'var(--surface)' : 'var(--surface2)',
                  border: `1px solid ${n.read ? 'var(--border)' : 'rgba(124,110,248,0.3)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '1.25rem', flexShrink: 0 }}>{config.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {n.title}
                      {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                    {!n.read && (
                      <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }} onClick={() => handleRead(n._id)}>
                        Read
                      </button>
                    )}
                    <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', color: 'var(--danger)' }} onClick={() => handleDelete(n._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Notifications