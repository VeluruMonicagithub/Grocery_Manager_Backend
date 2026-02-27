import * as NotificationModel from "../models/notificationModel.js";

export const fetchNotifications = async (req, res) => {
    const userId = req.user.id;
    const { data, error } = await NotificationModel.getNotifications(userId);

    if (error) return res.status(400).json({ error });
    res.json(data);
};

export const markNotificationRead = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await NotificationModel.markAsRead(id, userId);

    if (error) return res.status(400).json({ error });
    res.json(data);
};

export const addNotification = async (ownerId, message, type) => {
    try {
        await NotificationModel.createNotification({
            user_id: ownerId,
            message,
            type
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};
