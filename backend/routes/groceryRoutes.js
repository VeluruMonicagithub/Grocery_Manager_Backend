import express from "express";
import {
    fetchGrocery,
    createGroceryItem,
    toggleGrocery,
    setBudget
} from "../controllers/groceryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchGrocery);
router.post("/", authenticateUser, createGroceryItem);
router.put("/", authenticateUser, toggleGrocery);
router.put("/budget", authenticateUser, setBudget);

export default router;