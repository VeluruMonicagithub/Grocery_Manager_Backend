import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pantryRoutes from "./routes/pantryRoutes.js";
import groceryRoutes from "./routes/groceryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pantry", pantryRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/members", memberRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});

