import express from 'express';
import {
  registerServiceProvider,
  loginServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProvider,
  deleteServiceProvider,
  verifyServiceProviderOtp,
  getSPEarnings
} from '../controllers/serviceProviderController.js';

import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ✅ Registration & Login
router.post('/register', upload.single('profilePic'), registerServiceProvider);
router.post('/login', loginServiceProvider);
router.post('/verify-otp', verifyServiceProviderOtp); // ✅ MUST come before :id routes

// ✅ Public - Browse Service Providers
router.get('/', getAllServiceProviders);

// ✅ SP Revenue Panel
router.get('/earnings/:id', getSPEarnings);

// ✅ ⚠️ KEEP THESE LAST
router.get('/:id', getServiceProviderById);
router.put('/:id', upload.single('profilePic'), updateServiceProvider); // ✅ ADDED upload middleware here
router.delete('/:id', deleteServiceProvider);

export default router;
