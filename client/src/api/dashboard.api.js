import API from './axios'

export const getOwnerStats = () => API.get('/dashboard/stats')
export const getBookingsPerDay = () => API.get('/dashboard/bookings-per-day')
export const getPeakHours = () => API.get('/dashboard/peak-hours')
export const getOwnerReservations = (params) => API.get('/dashboard/reservations', { params })
export const updateReservationStatus = (id, status) => API.patch(`/dashboard/reservations/${id}/status`, { status })
export const getMyVenues = () => API.get('/venues/my')
export const updateVenueSettings = (id, data) => API.patch(`/venues/${id}/settings`, data)
export const getResourcesByVenue = (venueId) => API.get(`/venues/${venueId}/resources`)
export const createResource = (venueId, data) => API.post(`/venues/${venueId}/resources`, data)
export const updateResource = (venueId, resourceId, data) => API.put(`/venues/${venueId}/resources/${resourceId}`, data)
export const deleteResource = (venueId, resourceId) => API.delete(`/venues/${venueId}/resources/${resourceId}`)