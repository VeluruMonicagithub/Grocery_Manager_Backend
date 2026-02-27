import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pantryRoutes from "./routes/pantryRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/pantry", pantryRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(process.env.PORT || 5001, () => {
    console.log(`Server running on port ${process.env.PORT || 5001}`);
});

