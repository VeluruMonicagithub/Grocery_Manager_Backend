import express from "express";
import { askChef, getEstimatedPrice, getNutritionEstimate } from "../controllers/aiController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, askChef);
router.post("/estimate-price", authenticateUser, getEstimatedPrice);
router.post("/estimate-nutrition", authenticateUser, getNutritionEstimate);

export default router;
