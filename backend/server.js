import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ✅ Routes
import userRoutes from './routes/userRoutes.js';
import serviceProviderRoutes from './routes/serviceProviderRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import forgotPasswordRoutes from './routes/forgotPasswordRoutes.js';

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Resolve current directory (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure 'uploads' folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log('📁 "uploads" folder created');
}

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Prevent payload too large errors

// ✅ Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ✅ API Routes
app.use('/api/user', userRoutes);
app.use('/api/serviceprovider', serviceProviderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ MongoDB Connection & Server Start
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
