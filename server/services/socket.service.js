const { getIO } = require('../config/socket');

/**
 * Emit availability update to all clients watching a specific room
 */
const emitAvailabilityUpdate = (roomId, payload = {}) => {
  const io = getIO();
  io.to(roomId.toString()).emit('availability-updated', {
    roomId,
    ...payload,
  });
};

/**
 * Emit to all connected clients (global broadcast)
 */
const broadcastAvailabilityUpdate = (payload = {}) => {
  const io = getIO();
  io.emit('availability-updated', payload);
};

module.exports = { emitAvailabilityUpdate, broadcastAvailabilityUpdate };