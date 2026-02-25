import { supabase } from "../config/supabaseClient.js";

/* Get User Profile */
export const getProfile = async (userId) => {
    return await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
};

/* Upsert User Profile (Create or Update) */
export const upsertProfile = async (userId, profileData) => {
    return await supabase
        .from("profiles")
        .upsert({ id: userId, ...profileData })
        .select()
        .single();
};
