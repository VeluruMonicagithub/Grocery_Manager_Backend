import express from "express";
import { fetchMealPlans, createMealPlan, removeMealPlan } from "../controllers/mealPlanController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchMealPlans);
router.post("/", authenticateUser, createMealPlan);
router.delete("/:id", authenticateUser, removeMealPlan);

export default router;
