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
import Dashboard from './pages/Dashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import ResourceManagement from './pages/ResourceManagement'
import ReservationManagement from './pages/ReservationManagement'
import VenueSettings from './pages/VenueSettings'


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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/resources" element={<ProtectedRoute><ResourceManagement /></ProtectedRoute>} />
          <Route path="/dashboard/reservations" element={<ProtectedRoute><ReservationManagement /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><VenueSettings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App