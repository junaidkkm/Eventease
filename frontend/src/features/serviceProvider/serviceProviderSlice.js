// src/features/serviceprovider/serviceProviderSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/serviceprovider';

// 🔹 Fetch all service providers
export const fetchProviders = createAsyncThunk(
  'provider/fetchProviders',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch providers'
      );
    }
  }
);

// 🔹 Fetch single provider profile
export const fetchProviderProfile = createAsyncThunk(
  'provider/fetchProfile',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch provider profile'
      );
    }
  }
);

// 🔹 Update provider profile
export const updateProviderProfile = createAsyncThunk(
  'provider/updateProfile',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update provider profile'
      );
    }
  }
);

const providerSlice = createSlice({
  name: 'provider',
  initialState: {
    provider: null,        // For single provider profile
    providers: [],         // For provider list
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all providers
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single provider profile
      .addCase(fetchProviderProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.provider = action.payload;
      })
      .addCase(fetchProviderProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update provider profile
      .addCase(updateProviderProfile.fulfilled, (state, action) => {
        state.provider = action.payload;
      })
      .addCase(updateProviderProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default providerSlice.reducer;
