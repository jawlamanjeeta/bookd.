import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { getUnreadCount } from '../api/advanced.api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!user) return
    getUnreadCount().then((res) => setUnread(res.data.count)).catch(() => {})
    const interval = setInterval(() => {
      getUnreadCount().then((res) => setUnread(res.data.count)).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">Book<span>d</span></Link>
      <div className="nav-links">
        <Link to="/venues" className="btn-ghost">Explore</Link>
        {user ? (
          <>
            <Link to="/my-bookings" className="btn-ghost">Bookings</Link>
            <Link to="/favorites" className="btn-ghost">Saved</Link>
            <Link to="/calendar" className="btn-ghost">Calendar</Link>
            <Link to="/recommendations" className="btn-ghost">For You</Link>
            <Link to="/insights" className="btn-ghost">Insights</Link>
            <Link to="/notifications" className="btn-ghost" style={{ position: 'relative' }}>
              🔔
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--danger)', color: '#fff',
                  fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
                  width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </Link>
            {user.role === 'admin' && (
              <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
            )}
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar