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
  password:{
        in:['body'],
        exists:{
            errorMessage:'password field is required'
        },
        notEmpty:{
            errorMessage:"password filed should not be empty"
        },
        trim:true,
        isStrongPassword:{
            options:{
                minLength:8,
                minUpperCase:1,
                minLowerCase:1,
                minNumber:1,
                minSymbol:1
            },
            errorMessage:"password length sould be 8 charecter and password sould contain 1 number, 1 symbol, 1 uppercase, 1 lowercase"
        }
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
    role: {
    in: ['body'],
    optional: true, // allow frontend to skip it; backend default will apply
    isIn: {
      options: [['serviceprovider']],
      errorMessage: 'Role must be serviceprovider',
    },
  },

};

export const serviceProviderLoginValidation = {
  email: {
    notEmpty: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Invalid email format' },
  },
  password: {
    notEmpty: { errorMessage: 'Password is required' },
    isLength: {
      options: { min: 1 },
      errorMessage: 'Password cannot be empty',
    },
  },
};
