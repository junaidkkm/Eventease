// src/components/BookingForm.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBooking } from '../features/booking/bookingSlice';

const BookingForm = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [serviceProviderId, setServiceProviderId] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    const bookingData = {
      userId,
      serviceProviderId,
      service,
      date
    };

    dispatch(createBooking(bookingData))
      .unwrap()
      .then((res) => {
        setMessage(`✅ Booking confirmed for ${res.service} on ${new Date(res.date).toLocaleDateString()}`);
        setUserId('');
        setServiceProviderId('');
        setService('');
        setDate('');
      })
      .catch((err) => {
        setMessage(`❌ Error: ${err}`);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Service</h2>

      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Service Provider ID"
        value={serviceProviderId}
        onChange={(e) => setServiceProviderId(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Service name"
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Book</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default BookingForm;
