import express from "express";
import { fetchRecipes, fetchRecipeDetails, getPantryMatchedRecipes, createRecipe, markRecipeAsPrepared } from "../controllers/recipeController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Note: authenticateUser ensures only logged in members browse recipes
router.get("/", authenticateUser, fetchRecipes);
router.post("/", authenticateUser, createRecipe);
router.get("/matcher", authenticateUser, getPantryMatchedRecipes);
router.get("/:id", authenticateUser, fetchRecipeDetails);
router.post("/prepare", authenticateUser, markRecipeAsPrepared);

export default router;
