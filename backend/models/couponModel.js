import { supabase } from "../config/supabaseClient.js";

/* Get All Valid Coupons */
export const getActiveCoupons = async () => {
    // Return all coupons where valid_till is greater than or equal to today
    const today = new Date().toISOString().split('T')[0];
    return await supabase
        .from("coupons")
        .select("*")
        .gte("valid_till", today)
        .order("valid_till", { ascending: true });
};
