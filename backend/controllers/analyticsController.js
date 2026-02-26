import { supabase } from "../config/supabaseClient.js";

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const timeFrame = req.query.timeFrame || 'monthly'; // weekly, monthly, yearly

        // 1. Get current list to find budget goal
        let { data: list } = await supabase
            .from("grocery_lists")
            .select("id, budget_limit")
            .eq("user_id", userId)
            .single();

        const goal = list?.budget_limit || 500; // Default if not set

        // 2. Fetch all completed shopping trips (history) for this user to get real spent money
        let { data: history } = await supabase
            .from("shopping_history")
            .select("total_spent")
            .eq("user_id", userId);

        let totalSpent = 0;
        if (history && history.length > 0) {
            totalSpent = history.reduce((sum, h) => sum + (parseFloat(h.total_spent) || 0), 0);
        }

        // 3. For categories, we need to look at checked items in the current list, 
        // OR we would need a more complex schema to track historical items.
        // For now, we aggregate the current list's checked items to show current spending breakdown
        let { data: items } = await supabase
            .from("grocery_items")
            .select("section, price, is_checked, quantity")
            .eq("list_id", list?.id);

        let currentListSpent = 0;
        let categoriesMap = {
            "Produce": 0,
            "Snacks": 0,
            "Dairy & Other": 0
        };

        if (items && items.length > 0) {
            items.forEach(item => {
                if (item.is_checked && item.price) {
                    const itemTotal = (parseFloat(item.price) || 0) * (item.quantity || 1);
                    currentListSpent += itemTotal;

                    const section = item.section?.toLowerCase() || "";
                    if (section.includes("produce") || section.includes("veg") || section.includes("fruit")) {
                        categoriesMap["Produce"] += itemTotal;
                    } else if (section.includes("snack") || section.includes("sweet")) {
                        categoriesMap["Snacks"] += itemTotal;
                    } else {
                        categoriesMap["Dairy & Other"] += itemTotal;
                    }
                }
            });
        }

        // If they have spent money historically, we use that for the main display, 
        // but if they haven't categorised anything yet, we still show the categories they have NOW.
        // To make it fully "real", we rely purely on the DB data:

        const categories = [
            { name: "Produce", amount: categoriesMap["Produce"], color: "#4caf50" }, // Green
            { name: "Snacks", amount: categoriesMap["Snacks"], color: "#ffca28" }, // Yellow
            { name: "Dairy & Other", amount: categoriesMap["Dairy & Other"], color: "#42a5f5" }, // Blue
        ].filter(c => c.amount > 0);

        // If history is empty and current list is empty, it will naturally be 0.
        // Use currentListSpent for the chart if history is smaller than current (meaning they are shopping right now)
        const displaySpent = Math.max(totalSpent, currentListSpent);

        res.json({
            goal,
            spent: displaySpent,
            categories
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
