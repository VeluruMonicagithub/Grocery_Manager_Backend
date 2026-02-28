import { GEMINI_BASE, GEMINI_MODEL } from "../config/aiConfig.js";

export const askChef = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
        }

        const systemPrompt = "You are a friendly, helpful, and highly skilled AI Chef named 'Pantry Chef'. Your goal is to help users with cooking, recipes, ingredient substitutions, and meal planning. Keep your answers relatively concise, formatted well, and enthusiastic.";

        let requestContents = [];

        if (history && history.length > 0) {
            requestContents = [...history];
        }

        requestContents.push({
            role: "user",
            parts: [{ text: (history && history.length > 0 ? "" : systemPrompt + "\n\nUser: ") + message }]
        });

        const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: requestContents })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ error: data.error?.message || "Failed to communicate with AI API" });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            return res.status(500).json({ error: "Empty response from AI" });
        }

        res.status(200).json({ reply });
    } catch (error) {
        console.error("askChef error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getEstimatedPrice = async (req, res) => {
    try {
        const { itemName } = req.body;

        if (!itemName) {
            return res.status(400).json({ error: "Item name is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
        }

        const prompt = `Return a realistic estimated price in INR (Indian Rupees) for 1 standard unit/packet of "${itemName}". Respond ONLY with a single numeric value, no symbols, no text. For example, if it's 50 rupees, respond with exactly: 50`;

        const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ error: "Failed to communicate with AI" });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        let estimatedPrice = 0;
        if (reply) {
            const numStr = reply.replace(/[^\d.]/g, '');
            estimatedPrice = Number(numStr) || 0;
        }

        res.status(200).json({ price: estimatedPrice });
    } catch (error) {
        console.error("getEstimatedPrice error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getNutritionEstimate = async (req, res) => {
    try {
        const { itemName } = req.body;

        if (!itemName) {
            return res.status(400).json({ error: "Item name is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
        }

        const prompt = `Return the estimated nutritional information for 100g of "${itemName}". 
        Respond ONLY with a JSON object containing keys: calories (numeric), protein (numeric, grams), carbs (numeric, grams), fat (numeric, grams). 
        Do not include any other text or markdown formatting. 
        Example: {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6}`;

        const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            return res.status(response.status).json({ error: "Failed to communicate with AI" });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        let nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        if (reply) {
            try {
                const jsonStr = reply.replace(/```json|```/g, '').trim();
                nutrition = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Failed to parse AI nutrition JSON", reply);
            }
        }

        res.status(200).json(nutrition);
    } catch (error) {
        console.error("getNutritionEstimate error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


