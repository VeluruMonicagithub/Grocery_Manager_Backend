import * as ProfileModel from "../models/profileModel.js";

export const fetchProfile = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await ProfileModel.getProfile(userId);

    // If no profile exists yet, it's not strictly an error, just return empty data
    if (error && error.code !== 'PGRST116') return res.status(400).json({ error });

    res.json(data || { id: userId, full_name: null, dietary_preferences: [] });
};

export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { full_name, dietary_preferences } = req.body;

    const { data, error } = await ProfileModel.upsertProfile(userId, {
        full_name,
        dietary_preferences
    });

    if (error) return res.status(400).json({ error });

    res.json(data);
};
