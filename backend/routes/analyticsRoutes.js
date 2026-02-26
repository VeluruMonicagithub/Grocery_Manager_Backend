import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getAnalytics);

export default router;
