// src/pages/ProvidersPage.js
import React from 'react';
import ServiceProviderList from '../components/ServiceProviderList';

const ServiceProviderPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Browse Service Providers</h1>
      <ServiceProviderList />
    </div>
  );
};

export default ServiceProviderPage;
