import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/auth.api'
import useAuth from '../hooks/useAuth'
import Navbar from '../components/Navbar'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await registerUser(form)
      login(res.data.user, res.data.token)
      navigate('/venues')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            <h2>Create account</h2>
            <p className="subtitle">Start booking in seconds</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selector">
                <div className={`role-option ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'user' })}>
                  👤 Customer
                </div>
                <div className={`role-option ${form.role === 'admin' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'admin' })}>
                  🏢 Venue Owner
                </div>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary" style={{ padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </>
  )
}

export default Register