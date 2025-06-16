// backend/validators/serviceProviderValidators.js

import ServiceProvider from '../models/ServiceProvider.js';

export const serviceProviderRegisterValidation = {
  name: {
    in: ['body'],
    exists: { errorMessage: 'Name is required' },
    notEmpty: { errorMessage: 'Name cannot be empty' },
    trim: true,
  },
  email: {
    in: ['body'],
    exists: { errorMessage: 'Email is required' },
    notEmpty: { errorMessage: 'Email cannot be empty' },
    isEmail: { errorMessage: 'Email format is invalid' },
    normalizeEmail: true,
    trim: true,
    custom: {
      options: async (email) => {
        const sp = await ServiceProvider.findOne({ email });
        if (sp) {
          throw new Error('Email already registered');
        }
        return true;
      },
    },
  },
  password: {
    in: ['body'],
    exists: { errorMessage: 'Password is required' },
    notEmpty: { errorMessage: 'Password cannot be empty' },
    isLength: {
      options: { min: 8, max: 12 },
      errorMessage: 'Password must be 8–12 characters',
    },
    matches: {
      options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      errorMessage: 'Password must contain uppercase, lowercase, number, and symbol',
    },
    trim: true,
  },
  contact: {
    in: ['body'],
    exists: { errorMessage: 'Contact is required' },
    notEmpty: { errorMessage: 'Contact cannot be empty' },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: 'Contact must be exactly 10 digits',
    },
    isNumeric: { errorMessage: 'Contact must contain only numbers' },
  },
  location: {
    in: ['body'],
    exists: { errorMessage: 'Location is required' },
    notEmpty: { errorMessage: 'Location cannot be empty' },
    trim: true,
  },
  service: {
    in: ['body'],
    exists: { errorMessage: 'Service is required' },
    notEmpty: { errorMessage: 'Service cannot be empty' },
    trim: true,
  },
};

export const serviceProviderLoginValidation = {
  email: {
    in: ['body'],
    exists: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Invalid email format' },
    trim: true,
  },
  password: {
    in: ['body'],
    exists: { errorMessage: 'Password is required' },
    notEmpty: { errorMessage: 'Password cannot be empty' },
    trim: true,
  },
};
