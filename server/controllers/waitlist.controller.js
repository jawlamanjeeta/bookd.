const Waitlist = require('../models/Waitlist');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const joinWaitlist = async (req, res, next) => {
  try {
    const { resourceId, venueId, startTime, endTime } = req.body;

    const existing = await Waitlist.findOne({
      user: req.user._id, resource: resourceId,
      startTime: new Date(startTime), status: 'waiting',
    });
    if (existing) return res.status(400).json({ message: 'Already on waitlist for this slot' });

    const entry = await Waitlist.create({
      user: req.user._id, resource: resourceId, venue: venueId,
      startTime: new Date(startTime), endTime: new Date(endTime),
    });

    res.status(201).json(entry);
  } catch (err) { next(err); }
};

const getMyWaitlist = async (req, res, next) => {
  try {
    const entries = await Waitlist.find({ user: req.user._id, status: 'waiting' })
      .populate('resource', 'name type')
      .populate('venue', 'name location')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) { next(err); }
};

const leaveWaitlist = async (req, res, next) => {
  try {
    await Waitlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true });
  } catch (err) { next(err); }
};

const notifyWaitlist = async (resourceId, startTime, endTime) => {
  try {
    const entries = await Waitlist.find({
      resource: resourceId,
      startTime: { $lte: new Date(endTime) },
      endTime: { $gte: new Date(startTime) },
      status: 'waiting',
    }).populate('user', 'name');

    for (const entry of entries) {
      await Notification.create({
        user: entry.user._id,
        type: 'resource_available',
        title: 'Slot Available!',
        message: 'A slot you were waiting for is now available. Book it before it's gone!',
        link: `/booking/${resourceId}`,
        meta: { resourceId, startTime, endTime },
      });

      await Waitlist.findByIdAndUpdate(entry._id, { status: 'notified', notifiedAt: new Date() });

      try {
        const io = getIO();
        io.to(entry.user._id.toString()).emit('notification', { type: 'resource_available' });
      } catch (_) {}
    }
  } catch (err) {
    console.error('[waitlist] notify error:', err.message);
  }
};

module.exports = { joinWaitlist, getMyWaitlist, leaveWaitlist, notifyWaitlist };