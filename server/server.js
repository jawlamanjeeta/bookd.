const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { startNoShowJob } = require('./services/noshow.service');

dotenv.config();
connectDB();
startNoShowJob();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/rooms', require('./routes/room.routes'));
app.use('/api/venues', require('./routes/venue.routes'));
app.use('/api/venues/:venueId/resources', require('./routes/resource.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/waitlist', require('./routes/waitlist.routes'));
app.use('/api/favorites', require('./routes/favorite.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));


const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.get('/', (req, res) => res.send('Bookd API running'));

const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));