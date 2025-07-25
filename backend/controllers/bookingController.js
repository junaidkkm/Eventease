import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// ✅ Utility to calculate duration in hours
const calculateHours = (startHour, endHour) => {
  const start = parseInt(startHour);
  const end = parseInt(endHour);
  return Math.max(end - start, 0);
};

// ✅ Create Booking (no payment yet)
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      serviceProviderId,
      service,
      date,
      startTime,
      endTime,
      hourlyRate
    } = req.body;

    if (!userId || !serviceProviderId || !service || !date || startTime === undefined || endTime === undefined || hourlyRate === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedHourlyRate = Number(hourlyRate);
    if (isNaN(parsedHourlyRate)) {
      return res.status(400).json({ message: 'Invalid hourly rate' });
    }

    const hours = calculateHours(startTime, endTime);
    if (hours <= 0) {
      return res.status(400).json({ message: 'Invalid time range' });
    }

    const totalAmount = Math.round(hours * parsedHourlyRate);
    const commissionRate = 0.1;
    const adminCommission = Math.round(totalAmount * commissionRate);
    const serviceProviderEarnings = totalAmount - adminCommission;

    const booking = await Booking.create({
      userId,
      serviceProviderId,
      service,
      date,
      startTime,
      endTime,
      hours,
      hourlyRate: parsedHourlyRate, // ✅ Ensure stored as number
      totalAmount,
      adminCommission,
      serviceProviderEarnings,
      status: 'Pending'
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error('❌ Booking Error:', err);
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

// ✅ Update Booking Status
// controllers/bookingController.js

const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Restrict re-update if already accepted/rejected
    if (booking.status === 'Accepted' || booking.status === 'Rejected') {
      return res.status(400).json({ message: 'Status has already been set and cannot be changed' });
    }

    // Accept or Reject only
    if (status !== 'Accepted' && status !== 'Rejected') {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status.toLowerCase()} successfully`, booking });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


// ✅ Mark as Paid (after Razorpay success)
export const markBookingAsPaid = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Mark as paid
    booking.isPaid = true;
    booking.paymentTime = Date.now();
    booking.status = 'Completed'; // <-- important for UI updates

    // Save Razorpay details
    booking.paymentDetails = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    };

    // Recalculate just in case
    const hours = calculateHours(booking.startTime, booking.endTime);
    const hourlyRate = Number(booking.hourlyRate) || 0;
    const totalAmount = Math.round(hours * hourlyRate);
    const commissionRate = 0.1;

    booking.totalAmount = totalAmount;
    booking.adminCommission = Math.round(totalAmount * commissionRate);
    booking.serviceProviderEarnings = totalAmount - booking.adminCommission;

    await booking.save();

    res.status(200).json({
      message: '✅ Payment marked successfully',
      booking,
    });
  } catch (err) {
    console.error('❌ markBookingAsPaid Error:', err);
    res.status(500).json({
      message: 'Payment update failed',
      error: err.message,
    });
  }
};

// ✅ Get Bookings by Service Provider
export const getBookingsByServiceProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(serviceProviderId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const bookings = await Booking.find({ serviceProviderId })
      .populate('userId', 'name email contact location') // Make sure these fields exist in DB
      .populate('serviceProviderId', 'name email service contact location'); // Optional

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};


// ✅ Get Bookings by User
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate('serviceProviderId', 'name email service contact location');
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// ✅ Admin: Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceProviderId', 'name service');
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// ✅ Delete Booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
};
