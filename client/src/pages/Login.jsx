import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth.api'
import useAuth from '../hooks/useAuth'
import Navbar from '../components/Navbar'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await loginUser(form)
      login(res.data.user, res.data.token)
      navigate('/venues')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <div>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your Bookd account</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input name="remember" type="checkbox" checked={form.remember} onChange={handleChange} style={{ width: 'auto' }} />
              Remember me
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary" style={{ padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </>
  )
}

export default Login