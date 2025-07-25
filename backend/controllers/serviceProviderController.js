import ServiceProvider from '../models/ServiceProvider.js';
import Booking from '../models/Booking.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔐 Token Generator
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// ✅ Register Service Provider
export const registerServiceProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      service,
      contact,
      location,
      hourlyRate,
    } = req.body;

    const normalizedEmail = email.toLowerCase();
    const existing = await ServiceProvider.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   const profilePic = req.file ? req.file.filename : 'default-dp.png';


    const provider = await ServiceProvider.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      service,
      contact,
      location,
      hourlyRate,
      role: 'serviceprovider',
      profilePic,
    });

    res.status(201).json({
      message: 'Service provider registered successfully',
      user: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        service: provider.service,
        contact: provider.contact,
        location: provider.location,
        hourlyRate: provider.hourlyRate,
        role: provider.role,
        profilePic: provider.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// ✅ Step 1: Login → Send OTP
export const loginServiceProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const provider = await ServiceProvider.findOne({ email: normalizedEmail });
    if (!provider) {
      return res.status(400).json({ message: 'Provider not found' });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    provider.otp = otp;
    provider.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await provider.save();

    console.log(`🔐 OTP for ${email}:`, otp);
    res.json({ message: 'OTP sent (for testing)', email });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// ✅ Step 2: Verify OTP
export const verifyServiceProviderOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    const provider = await ServiceProvider.findOne({ email: normalizedEmail });
    if (!provider) return res.status(404).json({ message: 'Provider not found' });

    if (!provider.otp || provider.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (provider.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Clear OTP
    provider.otp = null;
    provider.otpExpires = null;
    await provider.save();

    const token = generateToken(provider._id);

    res.json({
      message: 'OTP verified successfully',
      token,
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        service: provider.service,
        contact: provider.contact,
        location: provider.location,
        role: provider.role,
        profilePic: provider.profilePic,
        hourlyRate: provider.hourlyRate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// ✅ Get All Providers
export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().select('-password');
    res.status(200).json({ providers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch providers', error: err.message });
  }
};

// ✅ Get Single Provider by ID
export const getServiceProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).select('-password');
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.status(200).json(provider);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching provider', error: err.message });
  }
};

// ✅ Update Provider
// controllers/serviceProviderController.js


export const updateServiceProvider = async (req, res) => {
  try {
    const sp = await ServiceProvider.findById(req.params.id);
    if (!sp) return res.status(404).json({ message: 'Service provider not found' });

    // Handle uploaded image (profile picture)
    if (req.file) {
      sp.profilePic = req.file.filename;
    }

    // Update fields from request body
    const { name, email, contact, location, service } = req.body;
    if (name) sp.name = name;
    if (email) sp.email = email;
    if (contact) sp.contact = contact;
    if (location) sp.location = location;
    if (service) sp.service = service;

    const updatedSP = await sp.save();

    res.status(200).json({
      message: 'Service provider updated',
      serviceProvider: {
        _id: updatedSP._id,
        name: updatedSP.name,
        email: updatedSP.email,
        contact: updatedSP.contact,
        location: updatedSP.location,
        service: updatedSP.service,
        profilePic: updatedSP.profilePic,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Delete Provider
export const deleteServiceProvider = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndDelete(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.json({ message: 'Service provider deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

// ✅ Earnings Panel for SP
export const getSPEarnings = async (req, res) => {
  const serviceProviderId = req.params.id;
  try {
    const bookings = await Booking.find({
      serviceProviderId,
      status: 'Confirmed',
    });

    const totalEarnings = bookings.reduce((sum, b) => sum + b.providerEarnings, 0);
    const totalCommission = bookings.reduce((sum, b) => sum + b.adminCommission, 0);
    const totalBookings = bookings.length;

    res.json({ totalEarnings, totalCommission, totalBookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch earnings', error: error.message });
  }
};
