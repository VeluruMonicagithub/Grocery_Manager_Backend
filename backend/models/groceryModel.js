import { supabase } from "../config/supabaseClient.js";

/* Get or Create User Grocery List */
export const getOrCreateList = async (userId) => {
    let { data: list } = await supabase
        .from("grocery_lists")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (!list) {
        const { data } = await supabase
            .from("grocery_lists")
            .insert([{ user_id: userId }])
            .select()
            .single();

        return data;
    }

    return list;
};

/* Get Grocery Items */
export const getGroceryItems = async (listId) => {
    return await supabase
        .from("grocery_items")
        .select("*")
        .eq("list_id", listId)
        .order("section", { ascending: true });
};

/* Add Grocery Item */
export const addGroceryItem = async (item) => {
    return await supabase
        .from("grocery_items")
        .insert([item])
        .select();
};

/* Toggle Item */
export const toggleItem = async (id, is_checked) => {
    return await supabase
        .from("grocery_items")
        .update({ is_checked })
        .eq("id", id)
        .select();
};

/* Update List Budget */
export const updateListBudget = async (listId, budget_limit) => {
    return await supabase
        .from("grocery_lists")
        .update({ budget_limit })
        .eq("id", listId)
        .select()
        .single();
};