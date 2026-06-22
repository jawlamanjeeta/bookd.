import { useEffect, useState } from 'react'
import { getAnalytics } from '../api/advanced.api'
import Navbar from '../components/Navbar'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1C1C26', borderColor: '#2A2A35', borderWidth: 1,
      titleColor: '#F2F2F7', bodyColor: '#8E8E9A',
    },
  },
  scales: {
    x: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } } },
    y: { grid: { color: '#2A2A35' }, ticks: { color: '#8E8E9A', font: { size: 11 } }, beginAtZero: true },
  },
}

const MetricCard = ({ label, value, sub, color }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: color || 'var(--text)', marginBottom: '0.25rem' }}>{value}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>{sub}</div>}
  </div>
)

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const popularChart = {
    labels: data?.popularResources?.map((r) => r.name) || [],
    datasets: [{
      data: data?.popularResources?.map((r) => r.count) || [],
      backgroundColor: ['rgba(124,110,248,0.7)', 'rgba(240,165,0,0.7)', 'rgba(52,211,153,0.7)', 'rgba(248,113,113,0.7)', 'rgba(142,142,154,0.5)'],
      borderWidth: 0,
    }],
  }

  const peakChart = {
    labels: data?.peakTimes?.map((p) => p.hour) || [],
    datasets: [{
      label: 'Bookings',
      data: data?.peakTimes?.map((p) => p.count) || [],
      backgroundColor: 'rgba(240,165,0,0.6)',
      borderColor: 'var(--amber)',
      borderWidth: 2,
      borderRadius: 6,
    }],
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.4rem' }}>Owner Dashboard</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Analytics</h1>
        </div>

        {loading ? (
          <div className="loading" style={{ height: '300px' }}>Loading analytics...</div>
        ) : (
          <>
            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              <MetricCard label="Total Bookings" value={data?.totalBookings ?? 0} color="var(--text)" />
              <MetricCard label="Confirmed" value={data?.confirmedBookings ?? 0} color="var(--success)" />
              <MetricCard label="Cancelled" value={data?.cancelledBookings ?? 0} color="var(--danger)" />
              <MetricCard label="Occupancy Rate" value={`${data?.occupancyRate ?? 0}%`} color="var(--accent)" />
              <MetricCard label="Cancellation Rate" value={`${data?.cancellationRate ?? 0}%`} color="var(--warning)" />
              <MetricCard label="Total Revenue" value={`₹${data?.totalRevenue?.toLocaleString() ?? 0}`} color="var(--amber)" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem' }}>Peak Booking Times</div>
                {data?.peakTimes?.length > 0
                  ? <Bar data={peakChart} options={chartOptions} />
                  : <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '2rem' }}>No data yet</div>
                }
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '1.25rem' }}>Most Popular Resources</div>
                {data?.popularResources?.length > 0
                  ? <Doughnut data={popularChart} options={{ ...chartOptions, scales: undefined }} />
                  : <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: '2rem' }}>No data yet</div>
                }
              </div>
            </div>

            {/* Popular Resources Table */}
            {data?.popularResources?.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  Resource Performance
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Resource', 'Type', 'Bookings', 'Revenue'].map((h) => (
                        <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.popularResources.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase' }}>{r.type}</td>
                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)' }}>{r.count}</td>
                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>₹{r.revenue?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AnalyticsDashboard