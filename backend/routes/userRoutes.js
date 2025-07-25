import express from 'express';
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  verifyUserOtp
} from '../controllers/userController.js';

import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ✅ Register user with profile image upload
router.post('/register', upload.single('profilePic'), registerUser);

// ✅ Step 1: Login with password to generate OTP
router.post('/login', loginUser);

// ✅ Step 2: Verify OTP
router.post('/verify-otp', verifyUserOtp);

// ✅ Fetch all users
router.get('/', getAllUsers);

// ✅ Fetch single user by ID
router.get('/:id', getUserById);

// ✅ Update user
router.put('/:id', upload.single('profilePic'), updateUser); // Added upload for update too

// ✅ Delete user
router.delete('/:id', deleteUser);

export default router;
