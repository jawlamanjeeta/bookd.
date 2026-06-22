import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Venues from './pages/Venues'
import VenueDetail from './pages/VenueDetail'
import BookingPage from './pages/BookingPage'
import BookingSuccess from './pages/BookingSuccess'
import MyBookings from './pages/MyBookings'
import OwnerDashboard from './pages/OwnerDashboard'
import ResourceManagement from './pages/ResourceManagement'
import ReservationManagement from './pages/ReservationManagement'
import VenueSettings from './pages/VenueSettings'
import Notifications from './pages/Notifications'
import Favorites from './pages/Favorites'
import CalendarView from './pages/CalendarView'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import FloorPlan from './pages/FloorPlan'
import QRCheckIn from './pages/QRCheckIn'
import Recommendations from './pages/Recommendations'
import Insights from './pages/Insights'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/booking/success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
          <Route path="/booking/:resourceId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/resources" element={<ProtectedRoute><ResourceManagement /></ProtectedRoute>} />
          <Route path="/dashboard/reservations" element={<ProtectedRoute><ReservationManagement /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><VenueSettings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/floor-plan/:venueId" element={<FloorPlan />} />
          <Route path="/qr/:bookingId" element={<ProtectedRoute><QRCheckIn /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App