import express from "express";
import { fetchRecipes, fetchRecipeDetails, getPantryMatchedRecipes } from "../controllers/recipeController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Note: authenticateUser ensures only logged in members browse recipes
router.get("/", authenticateUser, fetchRecipes);
router.get("/matcher", authenticateUser, getPantryMatchedRecipes);
router.get("/:id", authenticateUser, fetchRecipeDetails);

export default router;
