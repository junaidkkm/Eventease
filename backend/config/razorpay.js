// config/razorpay.js
import Razorpay from "razorpay";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Debug logs
console.log("🔑 RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("🔐 RAZORPAY_KEY_SECRET Loaded:", !!process.env.RAZORPAY_KEY_SECRET);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default instance;
