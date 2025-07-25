import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['serviceprovider'],
      default: 'serviceprovider',
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    profilePic: {
      type: String,
      default: '',
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Password comparison method
serviceProviderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('ServiceProvider', serviceProviderSchema);
