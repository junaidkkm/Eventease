// src/components/ServiceProviderList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProviders } from '../features/serviceProvider/serviceProviderSlice';

const ServiceProviderList = () => {
  const dispatch = useDispatch();
  const { providers, loading, error } = useSelector((state) => state.provider);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Service Providers</h2>
      {providers.length === 0 && <p>No providers available</p>}
      {providers.map((provider) => (
        <div key={provider._id} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
          <h4>{provider.name}</h4>
          <p>Email: {provider.email}</p>
          <p>Service: {provider.service}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceProviderList;
