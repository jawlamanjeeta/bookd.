const cron = require('node-cron');
const Booking = require('../models/Booking');
const { getIO } = require('../config/socket');

/**
 * Runs every minute
 * Releases pending bookings not confirmed within 15 minutes
 */
const startNoShowJob = () => {
  cron.schedule('* * * * *', async () => {
    const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 mins ago

    const released = await Booking.updateMany(
      {
        status: 'pending',
        createdAt: { $lt: cutoff },
      },
      {
        $set: { status: 'released' },
      }
    );

    if (released.modifiedCount > 0) {
      console.log(`[no-show] Released ${released.modifiedCount} unconfirmed bookings`);

      // Notify all connected clients to refresh availability
      try {
        const io = getIO();
        io.emit('availability-updated', { reason: 'no-show-release' });
      } catch (_) {
        // Socket may not be ready in test environments
      }
    }
  });

  console.log('[no-show] Job scheduled — checking every minute');
};

module.exports = { startNoShowJob };