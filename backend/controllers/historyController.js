import * as HistoryModel from "../models/historyModel.js";

export const fetchHistory = async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await HistoryModel.getHistory(userId);

    if (error) return res.status(400).json({ error });

    res.json(data);
};

export const createHistoryRecord = async (req, res) => {
    const userId = req.user.id;
    const { list_id, total_spent, categories, nutrition } = req.body;

    const { data, error } = await HistoryModel.addHistory(userId, list_id, total_spent, categories, nutrition);

    if (error) return res.status(400).json({ error });

    res.json(data);
};
