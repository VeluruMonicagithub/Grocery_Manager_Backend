import { supabase } from "../config/supabaseClient.js";

/* Get All Recipes */
export const getAllRecipes = async () => {
    return await supabase
        .from("recipes")
        .select("*");
};

/* Get Recipe Details with Ingredients */
export const getRecipeDetails = async (recipeId) => {
    // Note: To fetch relations in Supabase, we can use embedded selects if configured with foreign keys
    // Otherwise we map them explicitly.
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
