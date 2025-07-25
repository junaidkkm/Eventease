import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔐 Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact, location, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Always store full path to image
    const profilePic = req.file ? req.file.filename : 'default-avatar.jpg';

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      location,
      role,
      profilePic,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      contact: newUser.contact,
      location: newUser.location,
      role: newUser.role,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error('❌ Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Login (Step 1: Send OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log(`🔐 OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent (for testing)', email });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// ✅ OTP Verification (Step 2)
export const verifyUserOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP generated or OTP expired' });
    }

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        location: user.location,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error('❌ OTP Verification Error:', err.message);
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
     user.profilePic = req.file.filename;

    }

    const { name, email, contact, location, role } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (contact) user.contact = contact;
    if (location) user.location = location;
    if (role) user.role = role;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        location: updatedUser.location,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
}; 