import express from "express";
import { fetchProfile, updateProfile } from "../controllers/profileController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchProfile);
router.put("/", authenticateUser, updateProfile);

export default router;
