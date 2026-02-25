import { supabase } from "../config/supabaseClient.js";

export const getPantryItems = async (userId) => {
    return await supabase
        .from("pantry_items")
        .select("*")
        .eq("user_id", userId);
};

export const addPantryItem = async (item) => {
    return await supabase
        .from("pantry_items")
        .insert([item])
        .select();
};

export const updatePantryItem = async (id, quantity) => {
    return await supabase
        .from("pantry_items")
        .update({ quantity })
        .eq("id", id)
        .select();
};

export const deletePantryItem = async (id) => {
    return await supabase
        .from("pantry_items")
        .delete()
        .eq("id", id);
};
