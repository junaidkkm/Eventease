import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ServiceProviderPublicProfile = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/serviceprovider/${id}`);
        setProvider(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch service provider');
      }
    };

    fetchProvider();
  }, [id]);

  if (error) return <p className="text-red-600 text-center mt-6">{error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔍 Service Provider Profile</h2>

      {provider ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md space-y-3">
          <p><strong>👤 Name:</strong> {provider.name}</p>
          <p><strong>📧 Email:</strong> {provider.email}</p>
          <p><strong>📞 Contact:</strong> {provider.contact}</p>
          <p><strong>📍 Location:</strong> {provider.location}</p>
          <p><strong>🛠 Service:</strong> {provider.service}</p>
          <p><strong>💵 Hourly Rate:</strong> ₹{provider.hourlyRate || 0}</p>
          <p><strong>🕒 Available Slots:</strong> {provider.availableSlots?.length > 0 ? (
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {provider.availableSlots.map((slot, idx) => (
                <li key={idx}>{slot}</li>
              ))}
            </ul>
          ) : (
            'Not Available'
          )}</p>
        </div>
      ) : (
        <p className="text-gray-600">⏳ Loading profile...</p>
      )}
    </div>
  );
};

export default ServiceProviderPublicProfile;
