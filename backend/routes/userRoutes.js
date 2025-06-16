

import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { registerUser,loginUser,updateUser,updateUserById,getAllUsers,deleteUserById} from '../controllers/userController.js';
import {userRegisterValidation,userLoginValidation,} from '../validators/userValidators.js';


const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

router.post('/register', checkSchema(userRegisterValidation), validate, registerUser);
router.post('/login', checkSchema(userLoginValidation), validate, loginUser);
router.put('/update', updateUser);
router.put('/:id', updateUserById);
router.get('/', getAllUsers);
router.delete('/:id', deleteUserById);


export default router;
