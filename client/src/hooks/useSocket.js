import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const useSocket = (roomId, onAvailabilityUpdate) => {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL)

    if (roomId) {
      socketRef.current.emit('join-room', roomId)
    }

    socketRef.current.on('availability-updated', (data) => {
      if (onAvailabilityUpdate) onAvailabilityUpdate(data)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId])

  return socketRef.current
}

export default useSocket