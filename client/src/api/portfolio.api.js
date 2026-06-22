import API from './axios'

// Floor Plan
export const getFloorPlan = (venueId) => API.get(`/floorplan/${venueId}`)
export const generateFloorPlan = (venueId) => API.post(`/floorplan/${venueId}/generate`)
export const updateFloorPlan = (venueId, data) => API.post(`/floorplan/${venueId}`, data)

// QR
export const getBookingQR = (bookingId) => API.get(`/qr/${bookingId}`)
export const checkIn = (bookingId) => API.post('/qr/checkin', { bookingId })

// Recommendations
export const getRecommendations = () => API.get('/recommendations')

// Insights
export const getUserInsights = () => API.get('/insights')
