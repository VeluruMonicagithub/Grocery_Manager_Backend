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

        // 3. Nutrition & Category Aggregation
        let { data: items } = await supabase
            .from("grocery_items")
            .select("section, price, is_checked, quantity, calories, protein, carbs, fat")
            .eq("list_id", list?.id);

        let currentListSpent = 0;
        let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        let categoriesMap = { "Produce": 0, "Snacks": 0, "Dairy & Other": 0 };

        if (items && items.length > 0) {
            items.forEach(item => {
                if (item.is_checked) {
                    const qty = item.quantity || 1;

                    // Spending
                    if (item.price) {
                        const itemTotal = (parseFloat(item.price) || 0) * qty;
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

                    // Nutrition from purchases (Potentially bought nutrients)
                    nutrition.calories += (item.calories || 0) * qty;
                    nutrition.protein += (item.protein || 0) * qty;
                    nutrition.carbs += (item.carbs || 0) * qty;
                    nutrition.fat += (item.fat || 0) * qty;
                }
            });
        }

        // 4. Prepared Meals Nutrition (Actual intake)
        const { data: preparedMeals } = await supabase
            .from("prepared_meals")
            .select("portions, recipes(calories, protein, carbs, fat)")
            .eq("user_id", userId);

        if (preparedMeals && preparedMeals.length > 0) {
            preparedMeals.forEach(meal => {
                const recipe = meal.recipes;
                const portions = meal.portions || 1;
                if (recipe) {
                    nutrition.calories += (recipe.calories || 0) * portions;
                    nutrition.protein += (recipe.protein || 0) * portions;
                    nutrition.carbs += (recipe.carbs || 0) * portions;
                    nutrition.fat += (recipe.fat || 0) * portions;
                }
            });
        }

        const categories = [
            { name: "Produce", amount: categoriesMap["Produce"], color: "#4caf50" },
            { name: "Snacks", amount: categoriesMap["Snacks"], color: "#ffca28" },
            { name: "Dairy & Other", amount: categoriesMap["Dairy & Other"], color: "#42a5f5" },
        ].filter(c => c.amount > 0);

        const displaySpent = Math.max(totalSpent, currentListSpent);

        res.json({
            goal,
            spent: displaySpent,
            categories,
            nutrition
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
