import express from "express";
import { linkedInLoginData } from "../controllers/linkedInLogin.controller.js";
import { facebookLoginAuth } from "../controllers/facebookLogin.controller.js";
import { saveUserData } from "../controllers/googleLogin.controller.js";

const userRouter = express.Router();

userRouter.post("/google-login", saveUserData);
userRouter.post("/facebook-login", facebookLoginAuth);
userRouter.post("/linkedIn-login", linkedInLoginData);

export default userRouter;
