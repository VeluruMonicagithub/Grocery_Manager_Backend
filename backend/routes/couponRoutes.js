import express from "express";
import { fetchCoupons } from "../controllers/couponController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchCoupons);

export default router;
