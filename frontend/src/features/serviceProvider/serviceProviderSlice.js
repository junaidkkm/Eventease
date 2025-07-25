import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5001/api/serviceprovider';

// 🔹 Register Service Provider
export const registerServiceProvider = createAsyncThunk(
  'serviceProvider/register',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/register`, formData);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// 🔹 Login Service Provider
export const loginServiceProvider = createAsyncThunk(
  'serviceProvider/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// 🔹 Update Profile
export const updateServiceProvider = createAsyncThunk(
  'serviceProvider/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API}/${id}`, data);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// 🔹 Fetch All Service Providers
export const fetchAllServiceProviders = createAsyncThunk(
  'serviceProvider/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}`);
      return res.data.providers;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch providers');
    }
  }
);

// 🧱 Initial State
const initialState = {
  provider: (() => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  allProviders: [], // ✅ needed for browse page
  status: 'idle',
  error: null,
};

// 🔄 Slice
const serviceProviderSlice = createSlice({
  name: 'serviceProvider',
  initialState,
  reducers: {
    logoutProvider: (state) => {
      state.provider = null;
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerServiceProvider.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerServiceProvider.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provider = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(registerServiceProvider.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login
      .addCase(loginServiceProvider.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginServiceProvider.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provider = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(loginServiceProvider.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update
      .addCase(updateServiceProvider.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.provider = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })

      // Fetch All Providers
      .addCase(fetchAllServiceProviders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllServiceProviders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allProviders = action.payload;
      })
      .addCase(fetchAllServiceProviders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// 🔽 Exports
export const { logoutProvider } = serviceProviderSlice.actions;
export const selectServiceProvider = (state) => state.serviceProvider.provider;
export const selectAllProviders = (state) => state.serviceProvider.allProviders;
export const selectProviderStatus = (state) => state.serviceProvider.status;
export const selectProviderError = (state) => state.serviceProvider.error;

export default serviceProviderSlice.reducer;
