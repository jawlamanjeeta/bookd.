import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, PointElement, LineElement,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { getOwnerStats, getBookingsPerDay, getPeakHours } from '../api/dashboard.api'
import Navbar from '../components/Navbar'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

const chartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: '#1C1C26',
      borderColor: '#2A2A35',
      borderWidth: 1,
      titleColor: '#F2F2F7',
      bodyColor: '#8E8E9A',
    },
  },
  scales: {
    x: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } } },
    y: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } }, beginAtZero: true },
  },
})

const StatCard = ({ label, value, icon, color }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.5rem',
  }}>
    <div style={{ fontSize: '1.5rem' }}>{icon}</div>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: '2rem',
      fontWeight: 700, color: color || 'var(--text)',
    }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
  </div>
)

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null)
  const [perDay, setPerDay] = useState([])
  const [peakHours, setPeakHours] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOwnerStats(), getBookingsPerDay(), getPeakHours()])
      .then(([s, d, p]) => {
        setStats(s.data)
        setPerDay(d.data)
        setPeakHours(p.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const perDayData = {
    labels: perDay.map((d) => new Date(d.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Bookings',
      data: perDay.map((d) => d.count),
      backgroundColor: 'rgba(124, 110, 248, 0.6)',
      borderColor: '#7C6EF8',
      borderWidth: 2,
      borderRadius: 6,
    }],
  }

  const peakData = {
    labels: peakHours.filter((_, i) => i % 2 === 0).map((h) => h.hour),
    datasets: [{
      label: 'Bookings',
      data: peakHours.filter((_, i) => i % 2 === 0).map((h) => h.count),
      borderColor: '#F0A500',
      backgroundColor: 'rgba(240, 165, 0, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#F0A500',
      pointRadius: 4,
    }],
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Owner Dashboard</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Overview</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/dashboard/resources" className="btn-secondary">Manage Resources</Link>
            <Link to="/dashboard/reservations" className="btn-primary">Reservations</Link>
          </div>
        </div>

        {loading ? (
          <div className="loading" style={{ height: '300px' }}>Loading dashboard...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              <StatCard label="Today's Bookings" value={stats?.todaysBookings ?? 0} icon="📅" color="var(--accent)" />
              <StatCard label="Active Resources" value={stats?.activeResources ?? 0} icon="🏢" color="var(--text)" />
              <StatCard label="Occupancy Rate" value={`${stats?.occupancyRate ?? 0}%`} icon="📊" color="var(--amber)" />
              <StatCard label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() ?? 0}`} icon="💰" color="var(--success)" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem' }}>Bookings per Day</div>
                <Bar data={perDayData} options={chartOptions()} />
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem' }}>Peak Hours</div>
                <Line data={peakData} options={chartOptions()} />
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Manage Resources', desc: 'Add, edit, delete resources', to: '/dashboard/resources', icon: '🪑' },
                { label: 'Reservations', desc: 'Approve and manage bookings', to: '/dashboard/reservations', icon: '📋' },
                { label: 'Venue Settings', desc: 'Update your venue details', to: '/dashboard/settings', icon: '⚙️' },
                { label: 'Explore Venues', desc: 'See how your venue appears', to: '/venues', icon: '🔍' },
              ].map((item) => (
                <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '1.25rem',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default OwnerDashboard