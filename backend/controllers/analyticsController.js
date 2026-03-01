import { supabase } from "../config/supabaseClient.js";

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get current list to find budget goal
        const { data: list } = await supabase
            .from("grocery_lists")
            .select("id, budget_limit")
            .eq("user_id", userId)
            .single();

        const goal = list?.budget_limit || 500;

        // 2. Fetch all history records
        const { data: history } = await supabase
            .from("shopping_history")
            .select("total_spent, categories, nutrition")
            .eq("user_id", userId);

        let totalSpent = 0;
        let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        let categoriesMap = { "Produce": 0, "Snacks": 0, "Dairy & Other": 0 };

        // Aggregate from History
        if (history && history.length > 0) {
            history.forEach(trip => {
                totalSpent += (parseFloat(trip.total_spent) || 0);

                // Add up historical categories
                if (Array.isArray(trip.categories)) {
                    trip.categories.forEach(cat => {
                        if (categoriesMap[cat.name] !== undefined) {
                            categoriesMap[cat.name] += (cat.amount || 0);
                        } else {
                            categoriesMap["Dairy & Other"] += (cat.amount || 0);
                        }
                    });
                }

                // Add up historical nutrition
                if (trip.nutrition) {
                    nutrition.calories += (trip.nutrition.calories || 0);
                    nutrition.protein += (trip.nutrition.protein || 0);
                    nutrition.carbs += (trip.nutrition.carbs || 0);
                    nutrition.fat += (trip.nutrition.fat || 0);
                }
            });
        }

        // 3. Add Current List Items (that are checked) to the aggregation
        const { data: currentItems } = await supabase
            .from("grocery_items")
            .select("section, price, is_checked, quantity, calories, protein, carbs, fat")
            .eq("list_id", list?.id);

        if (currentItems && currentItems.length > 0) {
            currentItems.forEach(item => {
                if (item.is_checked) {
                    const qty = item.quantity || 1;
                    const itemTotal = (parseFloat(item.price) || 0) * qty;
                    totalSpent += itemTotal;

                    const section = item.section?.toLowerCase() || "";
                    if (section.includes("produce") || section.includes("veg") || section.includes("fruit")) {
                        categoriesMap["Produce"] += itemTotal;
                    } else if (section.includes("snack") || section.includes("sweet")) {
                        categoriesMap["Snacks"] += itemTotal;
                    } else {
                        categoriesMap["Dairy & Other"] += itemTotal;
                    }

                    nutrition.calories += (item.calories || 0) * qty;
                    nutrition.protein += (item.protein || 0) * qty;
                    nutrition.carbs += (item.carbs || 0) * qty;
                    nutrition.fat += (item.fat || 0) * qty;
                }
            });
        }

        // 4. Add Prepared Meals
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

        res.json({
            goal,
            spent: totalSpent,
            categories,
            nutrition
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};
