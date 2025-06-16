import ServiceProvider from '../models/ServiceProvider.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Register service provider


export const registerServiceProvider = async (req, res) => {
  try {
    const { name, email, password, service, contact, location } = req.body;

    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = new ServiceProvider({
      name,
      email,
      password: hashedPassword,
      service,
      contact,
      location,
    });

    await newProvider.save();
    res.status(201).json({ message: 'Service Provider registered successfully', provider: newProvider });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const loginServiceProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    const provider = await ServiceProvider.findOne({ email });
    if (!provider) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ✅ Create a JWT token (optional but recommended)
    const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // ✅ Send response with token and user info
    res.status(200).json({
      _id: provider._id,
      name: provider.name,
      email: provider.email,
      service: provider.service,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get all providers
export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find();
    if (!providers.length) {
      return res.status(404).json({ message: 'No service providers found' });
    }
    res.json({ providers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get provider by ID
export const getServiceProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update provider
export const updateServiceProvider = async (req, res) => {
  try {
    const updated = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.json({ message: 'Updated successfully', provider: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete provider
export const deleteServiceProvider = async (req, res) => {
  try {
    const deleted = await ServiceProvider.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
