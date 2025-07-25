import razorpay from '../config/razorpay.js';

export const createOrder = async (req, res) => {
  try {
    let { amount, currency = 'INR', receipt } = req.body;

    // ✅ Validate and parse amount
    amount = parseFloat(amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a valid number greater than 0',
      });
    }

    // ✅ Razorpay requires amount in paise (₹1400 => 140000)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || 'receipt_' + Date.now(),
    };

    // ✅ Create order
    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (err) {
    // ✅ Log full error for debugging
    console.error('❌ Razorpay order creation failed');
    console.error('TYPE:', typeof err);
    console.error('FULL ERROR OBJECT:', err);

    return res.status(500).json({
      success: false,
      error: err?.message || err?.description || 'Unknown error',
      fullError: err,
    });
  }
};
