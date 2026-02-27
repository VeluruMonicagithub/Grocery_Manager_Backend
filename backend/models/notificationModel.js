import { supabase } from "../config/supabaseClient.js";

export const getNotifications = async (userId) => {
    return await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
};

export const createNotification = async (notification) => {
    return await supabase
        .from("notifications")
        .insert([notification])
        .select();
};

export const markAsRead = async (id, userId) => {
    return await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", userId)
        .select();
};
