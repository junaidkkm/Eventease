import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProviderProfile,
  updateProviderProfile,
} from '../features/serviceProvider/serviceProviderSlice';

const serviceProviderProfile = () => {
  const dispatch = useDispatch();
  const { provider, loading } = useSelector((state) => state.provider);

  const [form, setForm] = useState({
    name: '',
    email: '',
    service: '',
    location: '',
  });

  const providerId = provider?._id || 'replace_with_loggedin_id';

  useEffect(() => {
    dispatch(fetchProviderProfile(providerId));
  }, [dispatch]);

  useEffect(() => {
    if (provider) {
      setForm({
        name: provider.name || '',
        email: provider.email || '',
        service: provider.service || '',
        location: provider.location || '',
      });
    }
  }, [provider]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProviderProfile({ id: providerId, data: form }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Provider Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="service" value={form.service} onChange={handleChange} placeholder="Service" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default serviceProviderProfile;
