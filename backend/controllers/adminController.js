import Booking from '../models/Booking.js';

export const getAdminEarnings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'Completed' });

    let totalRevenue = 0;
    let adminCommission = 0;
    let spEarnings = 0;

    bookings.forEach((booking) => {
      totalRevenue += booking.totalAmount;
      adminCommission += booking.totalAmount * 0.1;
      spEarnings += booking.totalAmount * 0.9;
    });

    res.status(200).json({
      earnings: {
        totalRevenue: Math.round(totalRevenue),
        totalCommission: Math.round(adminCommission),
        totalSPEarnings: Math.round(spEarnings),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch earnings', error: err.message });
  }
};
