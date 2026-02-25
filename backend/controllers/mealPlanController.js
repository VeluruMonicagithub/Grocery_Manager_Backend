import * as MealPlanModel from "../models/mealPlanModel.js";

export const fetchMealPlans = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await MealPlanModel.getMealPlans(userId);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const createMealPlan = async (req, res) => {
    const userId = req.user.id;
    const { recipe_id, planned_date } = req.body;

    const { data, error } = await MealPlanModel.addMealPlan(userId, recipe_id, planned_date);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const removeMealPlan = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await MealPlanModel.deleteMealPlan(id, userId);

    if (error) return res.status(400).json({ error });

    res.json({ message: "Meal plan deleted successfully." });
};
