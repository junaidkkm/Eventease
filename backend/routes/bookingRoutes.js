// routes/bookingRoutes.js
import express from 'express';
import {
  createBooking,
  getBookingsByServiceProvider,
  getBookingsByUser,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  markBookingAsPaid
} from '../controllers/bookingController.js';

const router = express.Router();

// ✅ Create a booking (no payment)
router.post('/create', createBooking);

// ✅ Status update (Accepted, Rejected, etc.)
router.put('/status/:bookingId', updateBookingStatus);

// ✅ After payment success - mark as paid
router.put('/mark-paid/:bookingId', markBookingAsPaid);

// ✅ Fetch by service provider or user
router.get('/serviceprovider/:serviceProviderId', getBookingsByServiceProvider);
router.get('/user/:userId', getBookingsByUser);

// ✅ Admin: get all bookings
router.get('/', getAllBookings);

// ✅ Delete booking
router.delete('/:id', deleteBooking);

export default router;
