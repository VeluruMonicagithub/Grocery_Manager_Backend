import express from "express";
import { fetchNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchNotifications);
router.put("/:id/read", authenticateUser, markNotificationRead);

export default router;
