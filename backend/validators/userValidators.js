import User from '../models/User.js';

export const userRegisterValidation = {
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
        const user = await User.findOne({ email });
        if (user) throw new Error('Email already registered');
        return true;
      },
    },
  },
  password: {
    in: ['body'],
    exists: { errorMessage: 'Password is required' },
    notEmpty: { errorMessage: 'Password should not be empty' },
    trim: true,
    isStrongPassword: {
      options: {
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage: 'Password should be strong (8+ characters, 1 upper, 1 lower, 1 number, 1 symbol)',
    },
  },
  contact: {
    in: ['body'],
    exists: { errorMessage: 'Contact is required' },
    notEmpty: { errorMessage: 'Contact cannot be empty' },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: 'Contact must be 10 digits',
    },
    isNumeric: { errorMessage: 'Contact must be numeric' },
  },
  location: {
  in: ['body'],
  exists: { errorMessage: 'Location is required' },
  notEmpty: { errorMessage: 'Location cannot be empty' },
  trim: true,
},

};

export const userLoginValidation = {
  email: {
    in: ['body'],
    exists: { errorMessage: 'Email is required' },
    isEmail: { errorMessage: 'Invalid email format' },
    normalizeEmail: true,
    trim: true,
  },
  password: {
    in: ['body'],
    exists: { errorMessage: 'Password is required' },
    notEmpty: { errorMessage: 'Password cannot be empty' },
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: 'Password must be 8-20 characters',
    },
    
  },
};
