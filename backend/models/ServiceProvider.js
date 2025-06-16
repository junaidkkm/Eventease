import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
  type: String,
  enum: ['serviceProvider'],
  required: true,
  default: 'serviceProvider'  
  },
  contact: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  service: {
    type: String, // The specific service the provider offers
    required: true,
  },
  // Other relevant fields can be added here
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
