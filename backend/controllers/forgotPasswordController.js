import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ServiceProvider from '../models/ServiceProvider.js';

const otpStore = new Map();

// 🔄 Simple inline OTP generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtpForReset = async (req, res) => {
  const { email, role } = req.body;
  try {
    const Model = role === 'serviceprovider' ? ServiceProvider : User;
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const otp = generateOtp();
    otpStore.set(email, otp);

    console.log(`🔐 OTP for ${email}: ${otp}`);
    res.json({ message: 'OTP sent to your email (console log in test mode)' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword, role } = req.body;
  try {
    const savedOtp = otpStore.get(email);
    if (otp !== savedOtp) return res.status(400).json({ message: 'Invalid OTP' });

    const Model = role === 'serviceprovider' ? ServiceProvider : User;
    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpStore.delete(email);
    res.json({ message: '✅ Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
};
