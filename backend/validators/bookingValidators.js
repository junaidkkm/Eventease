

export const bookingValidation = {
  userId: {
    in: ['body'],
    exists: {
      errorMessage: 'User ID is required'
    },
    isMongoId: {
      errorMessage: 'Invalid User ID format'
    }
  },
  serviceProviderId: {
  in: ['body'],
  isMongoId: {
    errorMessage: 'Invalid service provider ID format',
  },
  exists: {
    errorMessage: 'Service Provider ID is required',
  },
},

  service: {
    in: ['body'],
    exists: {
      errorMessage: 'Service is required'
    },
    notEmpty: {
      errorMessage: 'Service cannot be empty'
    },
    isString: {
      errorMessage: 'Service must be a string'
    }
  },
  date: {
    in: ['body'],
    exists: {
      errorMessage: 'Date is required'
    },
    isISO8601: {
      errorMessage: 'Date must be a valid ISO8601 date'
    }
  }
};
