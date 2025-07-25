import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Number, // hour in 24-hour format
    required: true
  },
  endTime: {
    type: Number,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  adminCommission: {
    type: Number,
    default: 0
  },
  serviceProviderEarnings: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: [ 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDetails: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
