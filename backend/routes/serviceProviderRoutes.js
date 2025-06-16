import express from 'express';
import { checkSchema } from 'express-validator';
import {serviceProviderRegisterValidation,serviceProviderLoginValidation,} from '../validators/serviceProviderValidators.js';
import {registerServiceProvider,loginServiceProvider,getAllServiceProviders,getServiceProviderById,updateServiceProvider,deleteServiceProvider,} from '../controllers/serviceProviderController.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';

const router = express.Router();

// Register
router.post('/register',checkSchema(serviceProviderRegisterValidation),handleValidationErrors,registerServiceProvider);

// Login
router.post('/login',checkSchema(serviceProviderLoginValidation),handleValidationErrors,loginServiceProvider);

// Get all service providers
router.get('/', getAllServiceProviders);

// Get a single service provider by ID
router.get('/:id', getServiceProviderById);

// Update a service provider by ID
router.put('/:id', updateServiceProvider);

// Delete a service provider by ID
router.delete('/:id', deleteServiceProvider);

export default router;
