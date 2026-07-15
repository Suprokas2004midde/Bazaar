import express from 'express'
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';
import validator from '../validators/zodValidator.js';
import { loginSchema,registerSchema,adminLoginSchema } from '../validators/userValidator.js'

const userRouter = express.Router();


userRouter.post('/login',    validator(loginSchema),      loginUser);
userRouter.post('/register', validator(registerSchema),   registerUser);
userRouter.post('/admin',    validator(adminLoginSchema), adminLogin);

export default userRouter;