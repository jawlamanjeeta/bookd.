import API from './axios'

export const createBooking = (data) => API.post('/bookings', data)
export const confirmBooking = (id) => API.patch(`/bookings/${id}/confirm`)
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`)
export const getMyBookings = () => API.get('/bookings/my')
export const getRoomBookings = (roomId) => API.get(`/bookings/room/${roomId}`)
export const getAllRooms = () => API.get('/rooms')