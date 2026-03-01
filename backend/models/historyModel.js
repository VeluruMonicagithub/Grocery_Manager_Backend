import { supabase } from "../config/supabaseClient.js";

/* Get Shopping History by Date */
export const getHistory = async (userId) => {
    return await supabase
        .from("shopping_history")
        .select(`
            *,
            grocery_lists (*)
        `)
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false });
};

/* Finish a shopping trip and move it to history */
export const addHistory = async (userId, listId, totalSpent, categories, nutrition) => {
    return await supabase
        .from("shopping_history")
        .insert([{
            user_id: userId,
            list_id: listId,
            total_spent: totalSpent,
            categories: categories || [],
            nutrition: nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 }
        }])
        .select()
        .single();
};
