import express from 'express';
import { validateBody } from "../../decorators/index.js";
import usersShemas from '../../schemas/users-shemas.js';
import authController from '../../controllers/auth-controller.js';

const authRouter = express.Router();


authRouter.post("/signup", validateBody(usersShemas.userSignupSchema), authController.signup)

authRouter.post("/signin", validateBody(usersShemas.userSigninSchema), authController.signin)

export default authRouter;