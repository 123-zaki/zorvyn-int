import express from "express";
import { changePassword, forgotPassword, getCurrentUser, login, logout, register, resendVerificationEmail, resetPassword, verify } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { validateLogin, validateRegister, validateResendVerificationEmail, verifyValidator } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = express.Router();

router.post("/register", validateRegister(), validate, register);

router.post("/login", validateLogin(), validate, login);

router.post("/logout", isLoggedIn, logout);

router.get("/me", isLoggedIn, getCurrentUser);

router.post("/change-password", isLoggedIn, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/verify/:userId/:otp", verifyValidator(), validate, verify);

router.post("/resend-verification-email", validateResendVerificationEmail(), validate, resendVerificationEmail);

export default router;