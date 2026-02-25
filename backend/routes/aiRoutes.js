import express from "express";
import { askChef, getEstimatedPrice } from "../controllers/aiController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, askChef);
router.post("/estimate-price", authenticateUser, getEstimatedPrice);

export default router;
