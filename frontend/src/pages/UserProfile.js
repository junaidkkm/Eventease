import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [passwords, setPasswords] = useState({ current: '', newPass: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch {
      return null;
    }
  }, []);

  const userId = useMemo(() => storedUser?._id || storedUser?.user?._id, [storedUser]);

  const getImageUrl = (filename) => {
    if (!filename) return 'http://localhost:5001/uploads/default-avatar.jpg';
    return filename.startsWith('http')
      ? filename
      : `http://localhost:5001/uploads/${filename}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('❌ User not logged in');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5001/api/user/${userId}`);
        const { name, email, contact, location, profilePic } = res.data;

        const userDetails = { name, email, contact, location };
        setFormData(userDetails);
        setOriginalData(userDetails);
        setPreview(getImageUrl(profilePic));
      } catch (err) {
        setError('⚠️ Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const hasChanges = () =>
    JSON.stringify(formData) !== JSON.stringify(originalData) || !!file;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleProfilePicUpload = async () => {
    if (!file) return;
    const data = new FormData();
    data.append('profilePic', file);

    try {
      await axios.put(`http://localhost:5001/api/user/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('🖼️ Profile picture updated!');
      setFile(null);
    } catch {
      toast.error('❌ Failed to update profile picture');
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) data.append('profilePic', file);

      await axios.put(`http://localhost:5001/api/user/${userId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setOriginalData(formData);
      setFile(null);
      toast.success('✅ Profile updated successfully!');
    } catch {
      toast.error('❌ Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || passwords.newPass.length < 6) {
      toast.error('Please enter a valid current and new password');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/user/${userId}/password`, passwords);
      setPasswords({ current: '', newPass: '' });
      toast.success('🔐 Password updated successfully!');
    } catch {
      toast.error('❌ Failed to update password');
    }
  };

  if (loading)
    return <p className="text-center mt-12 text-gray-600">⏳ Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">🙍‍♂️ User Profile</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={preview}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border shadow mb-2"
          onError={(e) =>
            (e.target.src = 'http://localhost:5001/uploads/default-avatar.jpg')
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />

        <button
          onClick={handleProfilePicUpload}
          disabled={!file}
          className={`text-sm px-3 py-1 rounded font-medium w-32 transition text-white ${
            file
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Update Photo
        </button>
      </div>

      {/* Profile Info */}
      <div className="bg-gray-50 rounded-lg shadow p-6 mb-6">
        {['name', 'contact', 'location'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={!hasChanges()}
            className={`text-sm font-medium px-4 py-1 rounded transition ${
              hasChanges()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">🔒 Change Password</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPass"
            value={passwords.newPass}
            onChange={handlePasswordChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePasswordUpdate}
            className={`text-sm font-medium px-4 py-1 rounded transition ${
              passwords.current && passwords.newPass
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!passwords.current || !passwords.newPass}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
