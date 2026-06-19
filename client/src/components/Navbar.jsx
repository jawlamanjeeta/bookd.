import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">Book<span>d</span></Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/venues" className="btn-ghost">Explore</Link>
            <Link to="/my-bookings" className="btn-ghost">My Bookings</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </>
        ) : (
          <>
            <Link to="/venues" className="btn-ghost">Explore</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar