import express from 'express';
import { checkSchema } from 'express-validator';
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  getBookingsByProvider,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';
import { bookingValidation } from '../validators/bookingValidators.js';

const router = express.Router();

// Create a booking
router.post('/create', checkSchema(bookingValidation), createBooking);

// Get all bookings
router.get('/', getAllBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Get bookings by user ID
router.get('/user/:userId', getBookingsByUser);

// Get bookings by service provider ID
router.get('/serviceprovider/:serviceProviderId', getBookingsByProvider);

// Update entire booking
router.put('/:bookingId', updateBooking);

// Update only booking status
router.put('/:bookingId/status', updateBookingStatus);

// Delete a booking
router.delete('/:bookingId', deleteBooking);

export default router;
