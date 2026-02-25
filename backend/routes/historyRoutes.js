import express from "express";
import { fetchHistory, createHistoryRecord } from "../controllers/historyController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchHistory);
router.post("/", authenticateUser, createHistoryRecord);

export default router;
