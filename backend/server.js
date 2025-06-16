import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import serviceProviderRoutes from './routes/serviceProviderRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';



dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('EventEase backend is running');
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/serviceprovider', serviceProviderRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
