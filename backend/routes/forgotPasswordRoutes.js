import express from 'express';
import {
  sendOtpForReset,
  verifyOtpAndResetPassword
} from '../controllers/forgotPasswordController.js';

const router = express.Router();

router.post('/send-otp', sendOtpForReset);
router.post('/verify-reset', verifyOtpAndResetPassword);

export default router;
