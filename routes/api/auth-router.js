import express from 'express';
import { validateBody } from "../../decorators/index.js";
import usersShemas from '../../schemas/users-shemas.js';
import authController from '../../controllers/auth-controller.js';
import { authentificate, upload } from "../../middlewares/index.js"

const authRouter = express.Router();


authRouter.post("/register", validateBody(usersShemas.userSignupSchema), authController.signup);

authRouter.post("/login", validateBody(usersShemas.userSigninSchema), authController.signin);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", validateBody(usersShemas.userEmailVerifySchema), authController.resendVerifyEmail)


authRouter.get("/current", authentificate, authController.getCurrent);

authRouter.post("/logout", authentificate, authController.signout);

authRouter.patch('/', authentificate, validateBody(usersShemas.userSigninSchema), authController.updateSubscriptionUser);

authRouter.patch('/avatars', authentificate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;