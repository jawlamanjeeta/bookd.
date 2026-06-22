import API from './axios'

// Notifications
export const getNotifications = () => API.get('/notifications')
export const getUnreadCount = () => API.get('/notifications/unread-count')
export const markAsRead = (id) => API.patch(`/notifications/${id}/read`)
export const markAllAsRead = () => API.patch('/notifications/read-all')
export const deleteNotification = (id) => API.delete(`/notifications/${id}`)

// Waitlist
export const joinWaitlist = (data) => API.post('/waitlist', data)
export const getMyWaitlist = () => API.get('/waitlist/my')
export const leaveWaitlist = (id) => API.delete(`/waitlist/${id}`)

// Favorites
export const getFavorites = () => API.get('/favorites')
export const addFavorite = (venueId) => API.post('/favorites', { venueId })
export const removeFavorite = (venueId) => API.delete(`/favorites/${venueId}`)
export const checkFavorite = (venueId) => API.get(`/favorites/check/${venueId}`)

// Reviews
export const getVenueReviews = (venueId) => API.get(`/reviews/${venueId}`)
export const createReview = (data) => API.post('/reviews', data)
export const deleteReview = (id) => API.delete(`/reviews/${id}`)

// Analytics
export const getAnalytics = () => API.get('/analytics')
export const getCalendarBookings = (params) => API.get('/analytics/calendar', { params })