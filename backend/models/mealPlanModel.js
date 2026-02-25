import { supabase } from "../config/supabaseClient.js";

/* Get user's meal plans with actual recipe details */
export const getMealPlans = async (userId) => {
    // We join the recipes table to get the recipe names/details instead of just the UUID
    return await supabase
        .from("meal_plans")
        .select(`
            *,
            recipes (*)
        `)
        .eq("user_id", userId)
        .order("planned_date", { ascending: true });
};

/* Add a Meal Plan */
export const addMealPlan = async (userId, recipeId, plannedDate) => {
    return await supabase
        .from("meal_plans")
        .insert([{
            user_id: userId,
            recipe_id: recipeId,
            planned_date: plannedDate
        }])
        .select()
        .single();
};

/* Remove a meal plan */
export const deleteMealPlan = async (id, userId) => {
    return await supabase
        .from("meal_plans")
        .delete()
        .match({ id: id, user_id: userId }); // user_id check acts as extra security
};
