import { useEffect, useState } from 'react'
import { getUserInsights } from '../api/portfolio.api'
import Navbar from '../components/Navbar'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useNavigate } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const TYPE_ICONS = {
  restaurant: '🍽️', meeting_room: '🏢', sports_court: '🎾', study_room: '📚',
}

const StatCard = ({ icon, value, label, color, sub }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: color || 'var(--text)', marginBottom: '0.25rem' }}>{value}</div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    {sub && <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{sub}</div>}
  </div>
)

const Insights = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserInsights()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const chartData = {
    labels: data?.bookingsPerMonth?.map((m) => {
      const [year, month] = m.month.split('-')
      return new Date(year, month - 1).toLocaleDateString('en', { month: 'short' })
    }) || [],
    datasets: [{
      label: 'Bookings',
      data: data?.bookingsPerMonth?.map((m) => m.count) || [],
      backgroundColor: 'rgba(124,110,248,0.6)',
      borderColor: '#7C6EF8',
      borderWidth: 2,
      borderRadius: 6,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1C1C26', borderColor: '#2A2A35', borderWidth: 1, titleColor: '#F2F2F7', bodyColor: '#8E8E9A' } },
    scales: {
      x: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } } },
      y: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } }, beginAtZero: true, ticks: { stepSize: 1 } },
    },
  }

  if (loading) return <><Navbar /><div className="loading">Loading insights...</div></>

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Personal</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Your Booking Insights</h1>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <StatCard icon="📅" value={data?.totalBookings ?? 0} label="Total Bookings" color="var(--text)" />
          <StatCard icon="✅" value={data?.confirmedBookings ?? 0} label="Confirmed" color="var(--success)" />
          <StatCard icon="❌" value={data?.cancelledBookings ?? 0} label="Cancelled" color="var(--danger)" />
          <StatCard icon="⏱️" value={`${data?.totalHours ?? 0}h`} label="Hours Booked" color="var(--accent)" />
          <StatCard icon="💰" value={`₹${data?.totalSpend?.toLocaleString() ?? 0}`} label="Total Spend" color="var(--amber)" />
        </div>

        {/* Favorite Venue */}
        {data?.favoriteVenue && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', cursor: 'pointer' }}
            onClick={() => navigate(`/venues/${data.favoriteVenue._id}`)}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--amber)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '3rem' }}>{TYPE_ICONS[data.favoriteVenue.type] || '🏢'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>⭐ Favourite Venue</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>{data.favoriteVenue.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                📍 {data.favoriteVenue.location?.city} · Visited {data.favoriteVenueCount} time{data.favoriteVenueCount !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--amber)' }}>{data.favoriteVenueCount}x</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>bookings</div>
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem' }}>Bookings Over Time</div>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Preferred Type */}
        {data?.preferredType && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>{TYPE_ICONS[data.preferredType] || '🏢'}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Your Style</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
                You prefer {data.preferredType.replace('_', ' ')}s
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Based on your booking history
              </div>
            </div>
            <button className="btn-primary" style={{ marginLeft: 'auto', padding: '0.6rem 1.25rem' }}
              onClick={() => navigate(`/venues?type=${data.preferredType}`)}>
              Explore More →
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Insights