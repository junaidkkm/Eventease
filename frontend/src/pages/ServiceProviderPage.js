import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceProviderPage = () => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/serviceprovider');
        setProviders(res.data.providers);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load service providers');
      }
    };

    fetchProviders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛠️ All Service Providers</h2>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {providers.map((sp) => (
          <div
            key={sp._id}
            className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow hover:shadow-md transition"
          >
            {sp.profilePic && (
              <img
                src={`http://localhost:5001${
                  sp.profilePic.startsWith('/') ? sp.profilePic : '/uploads/' + sp.profilePic
                }`}
                alt={sp.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="text-lg font-semibold">{sp.name}</h3>
            <p><strong>Service:</strong> {sp.service}</p>
            <p><strong>Location:</strong> {sp.location}</p>
            <p><strong>Contact:</strong> {sp.contact}</p>
            <Link
              to={`/service-provider/${sp._id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProviderPage;
