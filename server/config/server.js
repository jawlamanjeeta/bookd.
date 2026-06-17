const http = require('http');
const app = require('express')();
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const connectDB = require('./db');
const { initSocket } = require('./socket');

dotenv.config();
connectDB();

const { startNoShowJob } = require('./services/noshow.service');
// after connectDB();
startNoShowJob();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/rooms', require('./routes/room.routes'));

// Error handler — must be last
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.get('/', (req, res) => res.send('Bookd API running'));

const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));