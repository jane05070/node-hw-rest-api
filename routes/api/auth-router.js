import express from 'express';
import { validateBody } from "../../decorators/index.js";
import usersShemas from '../../schemas/users-shemas.js';
import authController from '../../controllers/auth-controller.js';
import { authentificate } from "../../middlewares/index.js"

const authRouter = express.Router();


authRouter.post("/signup", validateBody(usersShemas.userSignupSchema), authController.signup);

authRouter.post("/signin", validateBody(usersShemas.userSigninSchema), authController.signin);

authRouter.get("/current", authentificate, authController.getCurrent);

authRouter.post("/signout", authentificate, authController.signout);

authRouter.patch('/', authentificate, validateBody(usersShemas.userSigninSchema), authController.updateSubscriptionUser )

export default authRouter;