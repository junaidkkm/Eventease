import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    contact: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user'
    },
    otp: {
      type: String
    },
    otpExpires: {
      type: Date
    },
    profilePic: {
     type: String,
      default: ''
},

  },
  {
    timestamps: true
  }
);

// Optional: Method to match hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
