import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  const { providerId } = useParams();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState('');

  const hourOptions = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

  useEffect(() => {
    const fetchSP = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/serviceprovider/${providerId}`);
        setHourlyRate(res.data.hourlyRate || 0);
      } catch (err) {
        console.error('Error fetching SP rate', err);
      }
    };
    fetchSP();
  }, [providerId]);

  useEffect(() => {
    const start = Number(startTime);
    const end = Number(endTime);
    const duration = end - start;

    if (startTime !== '' && endTime !== '' && duration > 0 && hourlyRate > 0) {
      setTotalAmount(duration * hourlyRate);
    } else {
      setTotalAmount(0);
    }
  }, [startTime, endTime, hourlyRate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const bookingData = {
        userId: user._id,
        serviceProviderId: providerId,
        service: 'Event Service',
        date,
        startTime: Number(startTime),
        endTime: Number(endTime),
        hourlyRate,
      };

      const bookingRes = await axios.post('http://localhost:5001/api/bookings/create', bookingData);

      if (bookingRes.status === 201) {
        setMessage('✅ Booking successful! Waiting for service provider to accept.');
        setTimeout(() => navigate('/my-bookings'), 2000);
      }
    } catch (err) {
      console.error('❌ Booking Error:', err);
      setMessage(err.response?.data?.message || '❌ Booking failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">📅 Book a Service</h2>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Select Date:</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-medium mb-1">Start Time:</label>
            <select
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Select --</option>
              {hourOptions.map((hr) => (
                <option key={hr} value={hr}>
                  {hr < 12 ? `${hr === 0 ? 12 : hr} AM` : `${hr === 12 ? 12 : hr - 12} PM`}
                </option>
              ))}
            </select>
          </div>

          <div className="w-1/2">
            <label className="block font-medium mb-1">End Time:</label>
            <select
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Select --</option>
              {hourOptions.map((hr) => (
                <option key={hr} value={hr}>
                  {hr < 12 ? `${hr === 0 ? 12 : hr} AM` : `${hr === 12 ? 12 : hr - 12} PM`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {startTime !== '' && endTime !== '' && totalAmount === 0 && (
          <p className="text-sm text-red-600">⚠️ End time must be after start time.</p>
        )}

        <div className="mt-3 p-3 bg-blue-50 border rounded text-blue-800 font-semibold">
          ⏱ Hourly Rate: ₹{hourlyRate} <br />
          🧮 Total Amount: ₹{totalAmount.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={!date || !startTime || !endTime || totalAmount <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50"
        >
          📩 Book Now
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 p-2 text-center font-semibold rounded ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default BookingForm;
