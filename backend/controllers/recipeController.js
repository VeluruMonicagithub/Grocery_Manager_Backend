import * as RecipeModel from "../models/recipeModel.js";
import * as PantryModel from "../models/pantryModel.js";

export const createRecipe = async (req, res) => {
    try {
        const { title, description, dietary_tags, calories, protein, carbs, fat, image_url, ingredients } = req.body;

        const { data, error } = await RecipeModel.createRecipe({
            title, description, dietary_tags, calories, protein, carbs, fat, image_url
        });

        if (error) return res.status(400).json({ error });

        if (ingredients && ingredients.length > 0 && data) {
            const recipeId = data.id;
            const ingredientsToInsert = ingredients.map(i => ({
                recipe_id: recipeId,
                ingredient_name: i.ingredient_name,
                quantity: i.quantity,
                unit: i.unit
            }));

            const { error: ingError } = await RecipeModel.addRecipeIngredients(ingredientsToInsert);
            if (ingError) {
                console.error("Error inserting ingredients:", ingError);
            }
        }

        res.status(201).json(data);
    } catch (err) {
        console.error("Create Recipe Error:", err);
        res.status(500).json({ error: "Failed to create recipe." });
    }
};

export const fetchRecipes = async (req, res) => {
    const { data, error } = await RecipeModel.getAllRecipes();

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const fetchRecipeDetails = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await RecipeModel.getRecipeDetails(id);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const getPantryMatchedRecipes = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Fetch user's current pantry
        const { data: pantryItems, error: pantryErr } = await PantryModel.getPantryItems(userId);
        if (pantryErr) return res.status(400).json({ error: pantryErr });

        // Normalize pantry names for reliable matching (lowercase, trim)
        const userStockNames = pantryItems.map(item => item.name.toLowerCase().trim());

        // 2. Fetch all recipes from the database
        const { data: allRecipes, error: recipesErr } = await RecipeModel.getAllRecipes();
        if (recipesErr) return res.status(400).json({ error: recipesErr });

        // 3. The Matching Algorithm
        const matchedRecipes = [];

        for (const recipe of allRecipes) {
            // Fetch ingredients for this specific recipe
            const { data: requiredIngredients, error: ingErr } = await RecipeModel.getRecipeDetails(recipe.id);

            if (ingErr || !requiredIngredients || !requiredIngredients.ingredients || requiredIngredients.ingredients.length === 0) {
                // If we can't get ingredients, score it 0%
                matchedRecipes.push({ ...recipe, matchPercentage: 0, matchedCount: 0, totalRequired: 0 });
                continue;
            }

            const ingredientsList = requiredIngredients.ingredients;
            let matchedCount = 0;

            // Loop through required ingredients and see if user has them
            ingredientsList.forEach((reqIng) => {
                const reqName = reqIng.ingredient_name.toLowerCase().trim();

                // Flexible matching: If the pantry has "Chicken" and the recipe needs "Chicken Breast",
                // or vice-versa, we want it to count. 
                const hasIngredient = userStockNames.some(pantryName =>
                    pantryName.includes(reqName) || reqName.includes(pantryName)
                );

                if (hasIngredient) {
                    matchedCount++;
                }
            });

            // Calculate percentage
            const totalRequired = ingredientsList.length;
            const matchPercentage = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 0;

            matchedRecipes.push({
                ...recipe,
                matchPercentage,
                matchedCount,
                totalRequired
            });
        }

        // 4. Sort by Match Percentage (Highest first)
        matchedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // 5. Send back the highly sorted list
        res.json(matchedRecipes);

    } catch (err) {
        console.error("Pantry Matcher Error:", err);
        res.status(500).json({ error: "Failed to calculate pantry matches." });
    }
};
