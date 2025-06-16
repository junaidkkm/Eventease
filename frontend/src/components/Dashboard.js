import React from 'react';
import BookingForm from './BookingForm';
import BookingList from './BookingList';

const Dashboard = () => {
  return (
    <>
      <h2>Welcome to Dashboard</h2>
      <BookingForm />
      <BookingList />
    </>
  );
};

export default Dashboard;
