import express from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { getMonthlyTrends, getSummary, getTotalOfCategory } from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/summary", isLoggedIn, getSummary);

router.get("/total-of-category", isLoggedIn, getTotalOfCategory);

router.get("/monthly-trends", isLoggedIn, getMonthlyTrends);

export default router;