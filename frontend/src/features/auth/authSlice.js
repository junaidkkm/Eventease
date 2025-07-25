// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// 🔐 Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, thunkAPI) => {
    try {
      const endpoint =
        role === 'serviceprovider'
          ? '/serviceprovider/login'
          : '/user/login';

      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// 🆕 Register User with profilePic
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/user/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'User registration failed');
    }
  }
);

// 🆕 Register Service Provider with profilePic
export const registerServiceProvider = createAsyncThunk(
  'auth/registerServiceProvider',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/serviceprovider/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Service Provider registration failed'
      );
    }
  }
);

// 🧱 Initial State
const initialState = {
  user: (() => {
    try {
      const stored = localStorage.getItem('userInfo');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      localStorage.removeItem('userInfo');
      return null;
    }
  })(),
  status: 'idle',
  error: null,
};

// 🔄 Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userInfo');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      })

      // Register Service Provider
      .addCase(registerServiceProvider.fulfilled, (state, action) => {
        const user = action.payload.user || action.payload;
        state.status = 'succeeded';
        state.user = user;
        localStorage.setItem('userInfo', JSON.stringify(user));
      });
  },
});

// ⬇️ Exports
export const { logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
