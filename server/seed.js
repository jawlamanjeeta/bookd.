const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Venue = require('./models/Venue');
const Resource = require('./models/Resource');

dotenv.config();

const venues = [
  {
    name: 'The Grand Table',
    type: 'restaurant',
    description: 'A fine dining experience with modern Indian cuisine and elegant ambiance.',
    location: { address: '12 Connaught Place', city: 'New Delhi' },
    rules: ['No outside food', 'Smart casual dress code', 'Reservations required'],
    openingHours: { open: '12:00', close: '23:00' },
    rating: 4.8,
    totalReviews: 124,
  },
  {
    name: 'Spice Garden',
    type: 'restaurant',
    description: 'Authentic regional cuisines from across India in a warm, welcoming setting.',
    location: { address: '45 MG Road', city: 'Bangalore' },
    rules: ['No smoking', 'Children welcome', 'Group bookings available'],
    openingHours: { open: '11:00', close: '22:30' },
    rating: 4.5,
    totalReviews: 89,
  },
  {
    name: 'Nexus Hub',
    type: 'meeting_room',
    description: 'Premium co-working and meeting spaces with enterprise-grade AV equipment.',
    location: { address: '7 Cyber City', city: 'Gurugram' },
    rules: ['No loud calls in common areas', 'Book in advance', 'ID required at entry'],
    openingHours: { open: '08:00', close: '20:00' },
    rating: 4.7,
    totalReviews: 56,
  },
  {
    name: 'WorkFlow Spaces',
    type: 'meeting_room',
    description: 'Flexible meeting rooms for teams of all sizes with high-speed internet.',
    location: { address: '22 Bandra Kurla Complex', city: 'Mumbai' },
    rules: ['Clean up after use', 'No food in conference rooms', 'Cancel 2hrs in advance'],
    openingHours: { open: '09:00', close: '21:00' },
    rating: 4.6,
    totalReviews: 43,
  },
  {
    name: 'Arena Sports Club',
    type: 'sports_court',
    description: 'World-class courts for badminton, basketball, and squash with professional lighting.',
    location: { address: '88 Sardar Patel Marg', city: 'New Delhi' },
    rules: ['Sports shoes mandatory', 'Bring your own equipment', 'No food on courts'],
    openingHours: { open: '06:00', close: '22:00' },
    rating: 4.9,
    totalReviews: 201,
  },
  {
    name: 'PlayZone Courts',
    type: 'sports_court',
    description: 'Affordable sports courts for cricket nets, tennis, and football.',
    location: { address: '33 Koramangala', city: 'Bangalore' },
    rules: ['Book minimum 1 hour', 'No refunds within 1hr of slot', 'Bring ID'],
    openingHours: { open: '05:30', close: '21:30' },
    rating: 4.3,
    totalReviews: 77,
  },
  {
    name: 'Zenith Study Lounge',
    type: 'study_room',
    description: 'Quiet, distraction-free study rooms with high-speed WiFi and ergonomic seating.',
    location: { address: '5 University Road', city: 'Pune' },
    rules: ['Silence mandatory', 'No phone calls', 'Max 3 hour sessions'],
    openingHours: { open: '07:00', close: '23:00' },
    rating: 4.6,
    totalReviews: 38,
  },
  {
    name: 'Focus Rooms',
    type: 'study_room',
    description: 'Individual and group study pods designed for deep work and collaboration.',
    location: { address: '19 Anna Nagar', city: 'Chennai' },
    rules: ['No loud music', 'Clean desk policy', 'Food allowed in lounge only'],
    openingHours: { open: '08:00', close: '22:00' },
    rating: 4.4,
    totalReviews: 52,
  },
];

const getResources = (venueId, type) => {
  const maps = {
    restaurant: [
      { name: 'Table 1 — Window Seat', type: 'table', capacity: 2, pricePerHour: 0, amenities: ['Window view', 'Romantic setting'] },
      { name: 'Table 2 — Garden View', type: 'table', capacity: 4, pricePerHour: 0, amenities: ['Garden view', 'Natural light'] },
      { name: 'Table 3 — Private Booth', type: 'table', capacity: 6, pricePerHour: 0, amenities: ['Privacy screen', 'Extra space'] },
      { name: 'Private Dining Room', type: 'room', capacity: 12, pricePerHour: 500, amenities: ['Private room', 'Dedicated waiter', 'AV setup'] },
    ],
    meeting_room: [
      { name: 'Focus Room A', type: 'room', capacity: 4, pricePerHour: 300, amenities: ['Whiteboard', 'TV screen', 'WiFi'] },
      { name: 'Conference Room B', type: 'room', capacity: 10, pricePerHour: 600, amenities: ['Projector', 'Video conferencing', 'WiFi', 'Whiteboard'] },
      { name: 'Board Room', type: 'room', capacity: 20, pricePerHour: 1200, amenities: ['4K display', 'Video conferencing', 'WiFi', 'Catering available'] },
      { name: 'Hot Desk', type: 'desk', capacity: 1, pricePerHour: 100, amenities: ['Monitor', 'WiFi', 'Locker'] },
    ],
    sports_court: [
      { name: 'Badminton Court 1', type: 'court', capacity: 4, pricePerHour: 200, amenities: ['Professional lighting', 'Shuttle service'] },
      { name: 'Badminton Court 2', type: 'court', capacity: 4, pricePerHour: 200, amenities: ['Professional lighting'] },
      { name: 'Basketball Court', type: 'court', capacity: 10, pricePerHour: 400, amenities: ['Full court', 'Scoreboard'] },
      { name: 'Squash Court', type: 'court', capacity: 2, pricePerHour: 250, amenities: ['Glass back wall', 'Equipment rental'] },
    ],
    study_room: [
      { name: 'Solo Pod 1', type: 'room', capacity: 1, pricePerHour: 80, amenities: ['Standing desk', 'Monitor', 'WiFi'] },
      { name: 'Solo Pod 2', type: 'room', capacity: 1, pricePerHour: 80, amenities: ['Ergonomic chair', 'WiFi'] },
      { name: 'Group Room A', type: 'room', capacity: 4, pricePerHour: 200, amenities: ['Whiteboard', 'TV', 'WiFi'] },
      { name: 'Group Room B', type: 'room', capacity: 6, pricePerHour: 300, amenities: ['Projector', 'WiFi', 'Whiteboard'] },
    ],
  };
  return (maps[type] || []).map((r) => ({ ...r, venue: venueId }));
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Venue.deleteMany({});
    await Resource.deleteMany({});
    console.log('Cleared existing venues and resources');

    for (const venueData of venues) {
      const venue = await Venue.create(venueData);
      const resources = getResources(venue._id, venue.type);
      await Resource.insertMany(resources);
      console.log(`Seeded: ${venue.name} with ${resources.length} resources`);
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();