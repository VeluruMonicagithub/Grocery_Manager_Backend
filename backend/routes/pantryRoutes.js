import express from "express";
import {
    fetchPantry,
    createPantryItem,
    updatePantry,
    deletePantry,
} from "../controllers/pantryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, fetchPantry);
router.post("/", authenticateUser, createPantryItem);
router.put("/", authenticateUser, updatePantry);
router.delete("/:id", authenticateUser, deletePantry);

export default router;