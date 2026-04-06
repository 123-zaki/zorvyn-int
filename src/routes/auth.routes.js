import express from "express";
import { changePassword, forgotPassword, login, logout, register, resetPassword, verify } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { validateLogin, validateRegister, verifyValidator } from "../validators/auth.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = express.Router();

router.post("/register", validateRegister(), validate, register);

router.post("/login", validateLogin(), validate, login);

router.post("/logout", isLoggedIn, logout);

router.post("/change-password", isLoggedIn, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/verify/:userId/:otp", verifyValidator(), validate, verify);

export default router;