import * as PantryModel from "../models/pantryModel.js";
import { getSection } from "../utils/sectionOrganizer.js";

export const fetchPantry = async (req, res) => {
    const userId = req.user.id;

    const { data, error } =
        await PantryModel.getPantryItems(userId);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const createPantryItem = async (req, res) => {
    const userId = req.user.id;

    const { name, quantity, unit, threshold, expiration_date } = req.body;

    const category = getSection(name);
    // Let frontend optionally override auto-category if they passed one
    const finalCategory = req.body.category || category;

    const { data, error } = await PantryModel.addPantryItem({
        user_id: userId,
        name,
        category: finalCategory,
        quantity,
        unit,
        threshold,
        expiration_date,
    });

    if (error) return res.status(400).json({ error });

    res.json(data);
};
export const updatePantry = async (req, res) => {
    const userId = req.user.id;
    const { id, quantity } = req.body;

    const { data, error } =
        await PantryModel.updatePantryItem(id, quantity);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const deletePantry = async (req, res) => {
    const { id } = req.params;

    const { error } = await PantryModel.deletePantryItem(id);

    if (error) return res.status(400).json({ error });

    res.json({ message: "Deleted successfully" });
};

