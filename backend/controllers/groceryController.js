import * as GroceryModel from "../models/groceryModel.js";
import { getSection } from "../utils/sectionOrganizer.js";
import { supabase } from "../config/supabaseClient.js";
import { addNotification } from "./notificationController.js";

export const fetchGrocery = async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        // 1. Get all connected user IDs (including self)
        const { data: connectedUsers } = await supabase.rpc("get_connected_user_ids", {
            current_user_id: userId,
            current_user_email: userEmail
        });

        const userIds = connectedUsers ? connectedUsers.map(u => u.get_connected_user_ids) : [userId];

        // 2. Fetch all grocery lists belonging to this connected family
        const { data: lists } = await supabase
            .from("grocery_lists")
            .select("id, budget_limit")
            .in("user_id", userIds);

        // Make sure current user has a list at least
        let myPrimaryList = await GroceryModel.getOrCreateList(userId);

        const listIds = lists && lists.length > 0 ? lists.map(l => l.id) : [myPrimaryList.id];

        // 3. Fetch items across all those lists
        const { data: items, error } = await supabase
            .from("grocery_items")
            .select("*")
            .in("list_id", listIds)
            .order("section", { ascending: true });

        if (error) return res.status(400).json({ error });

        // Sum the budget across lists, or just pass the primary list specs
        res.json({ list: myPrimaryList, items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch shared groceries" });
    }
};

export const createGroceryItem = async (req, res) => {
    const userId = req.user.id;
    const { name, quantity, price, coupon, notes } = req.body;

    const list = await GroceryModel.getOrCreateList(userId);

    const section = getSection(name);

    // Call AI for nutrition estimate if columns exist
    let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            const prompt = `Return the estimated nutritional information for 100g or 1 standard packet of "${name}". 
            Respond ONLY with a JSON object containing keys: calories (numeric), protein (numeric), carbs (numeric), fat (numeric). 
            Example: {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6}`;

            const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            const aiData = await aiRes.json();
            const reply = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
                const jsonStr = reply.replace(/```json|```/g, '').trim();
                nutrition = JSON.parse(jsonStr);
            }
        }
    } catch (err) {
        console.error("Auto-nutrition failed:", err);
    }

    const { data, error } =
        await GroceryModel.addGroceryItem({
            list_id: list.id,
            name,
            section,
            quantity,
            price,
            coupon,
            notes,
            ...nutrition
        });

    if (error) return res.status(400).json({ error });

    if (req.user.isGuest) {
        addNotification(req.user.id, `Guest added "${name}" to shopping list`, "grocery_add");
    }

    res.json(data);
};

export const toggleGrocery = async (req, res) => {
    const { id, is_checked } = req.body;

    const { data, error } =
        await GroceryModel.toggleItem(id, is_checked);

    if (error) return res.status(400).json({ error });

    if (req.user.isGuest) {
        const itemName = data?.[0]?.name || "item";
        const action = is_checked ? "checked off" : "unchecked";
        addNotification(req.user.id, `Guest ${action} "${itemName}"`, "grocery_toggle");
    }

    res.json(data);
};

export const setBudget = async (req, res) => {
    const userId = req.user.id;
    const { budget_limit } = req.body;

    const list = await GroceryModel.getOrCreateList(userId);

    const { data, error } = await GroceryModel.updateListBudget(list.id, budget_limit);

    if (error) return res.status(400).json({ error });

    res.json(data);
};