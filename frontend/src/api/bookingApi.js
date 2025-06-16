import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // backend URL

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${BASE_URL}/bookings`, bookingData);
  return response.data;
};

export const fetchBookings = async () => {
  const response = await axios.get(`${BASE_URL}/bookings`);
  return response.data;
};
