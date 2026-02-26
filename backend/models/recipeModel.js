import { supabase } from "../config/supabaseClient.js";

/* Get All Recipes */
export const getAllRecipes = async () => {
    return await supabase
        .from("recipes")
        .select("*");
};

/* Get Recipe Details with Ingredients */
export const getRecipeDetails = async (recipeId) => {
    const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", recipeId)
        .single();

    if (recipeError) return { error: recipeError };

    const { data: ingredients, error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .select("*")
        .eq("recipe_id", recipeId);

    if (ingredientsError) return { error: ingredientsError };

    return { data: { ...recipe, ingredients } };
};

/* Create Recipe */
export const createRecipe = async (recipeData) => {
    return await supabase
        .from("recipes")
        .insert(recipeData)
        .select()
        .single();
};

/* Add Recipe Ingredients */
export const addRecipeIngredients = async (ingredientsData) => {
    return await supabase
        .from("recipe_ingredients")
        .insert(ingredientsData);
};
