const Room = require('../models/Room');

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ isActive: true });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const { name, capacity, amenities, location } = req.body;
    const room = await Room.create({ name, capacity, amenities, location });
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deactivated' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };