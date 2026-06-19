import API from './axios'

// Venues
export const getAllVenues = (params) => API.get('/venues', { params })
export const getVenueById = (id) => API.get(`/venues/${id}`)
export const getResourcesByVenue = (venueId, params) =>
  API.get(`/venues/${venueId}/resources`, { params })
export const getResourceById = (id) => API.get(`/venues/resources/${id}`)

// Bookings
export const createBooking = (data) => API.post('/bookings', data)
export const confirmBooking = (id) => API.patch(`/bookings/${id}/confirm`)
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`)
export const getMyBookings = (params) => API.get('/bookings/my', { params })
export const getBookingById = (id) => API.get(`/bookings/${id}`)
export const getResourceBookings = (resourceId) =>
  API.get(`/bookings/resource/${resourceId}`)