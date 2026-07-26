import express from 'express'
import { loginUser,registerUser,adminLogin, getUserProfile } from '../controllers/userController.js';
import validator from '../validators/zodValidator.js';
import { loginSchema,registerSchema,adminLoginSchema } from '../validators/userValidator.js'
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();


userRouter.post('/login',    validator(loginSchema),      loginUser);
userRouter.post('/register', validator(registerSchema),   registerUser);
userRouter.post('/admin',    validator(adminLoginSchema), adminLogin);
userRouter.get('/profile',   userAuth,                    getUserProfile);

export default userRouter;