import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingsByUserId,
  selectUserBookings,
  selectBookingStatus,
  selectBookingError,
} from '../features/booking/bookingSlice';

const UserBookingPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectUserBookings);
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userId = userInfo?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchBookingsByUserId(userId));
    }
  }, [dispatch, userId]);

  const handlePayment = async (booking) => {
    try {
      const res = await fetch('http://localhost:5001/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: booking.totalAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        }),
      });

      const { order } = await res.json();

      const options = {
        key: 'rzp_test_WLIkcBbQ1HYKZR',
        amount: order.amount,
        currency: order.currency,
        name: 'EventEase',
        description: 'Service Payment',
        order_id: order.id,
        handler: async function (response) {
          alert('✅ Payment Successful!');
          await fetch(`http://localhost:5001/api/bookings/mark-paid/${booking._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          dispatch(fetchBookingsByUserId(userId));
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.contact,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('❌ Razorpay Error:', err);
      alert('❌ Payment failed. Please try again.');
    }
  };

  if (status === 'loading') {
    return <p className="text-center mt-6 text-gray-600">⏳ Loading bookings...</p>;
  }

  if (status === 'failed') {
    return <p className="text-red-600 text-center mt-6">❌ {error}</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">📋 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You haven’t made any bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white border border-gray-200 rounded-md shadow-sm p-5 mb-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p><strong>🛠 Service:</strong> {booking.service}</p>
              <p><strong>📅 Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>👨‍🔧 Provider:</strong> {booking.serviceProviderId?.name || 'N/A'}</p>
              <p><strong>📍 Location:</strong> {booking.serviceProviderId?.location || 'N/A'}</p>
              <p><strong>📞 Contact:</strong> {booking.serviceProviderId?.contact || 'N/A'}</p>
              <p><strong>💰 Amount:</strong> ₹{booking.totalAmount}</p>
              <p className="col-span-2">
                <strong>📌 Status:</strong>
                <span className={`ml-2 font-medium ${
                  booking.status === 'Pending' ? 'text-yellow-600' :
                  booking.status === 'Accepted' ? 'text-blue-600' :
                  booking.status === 'Completed' ? 'text-green-600' :
                  booking.status === 'Rejected' ? 'text-red-600' :
                  'text-gray-700'
                }`}>
                  {booking.status}
                </span>
              </p>
            </div>

            {/* Payment Actions */}
            {booking.status === 'Accepted' && !booking.isPaid && (
              <button
                onClick={() => handlePayment(booking)}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                💳 Pay Now
              </button>
            )}

            {booking.isPaid && (
              <p className="text-green-600 font-medium mt-3">✅ Payment Completed</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserBookingPage;
