import dotenv from "dotenv";
dotenv.config();

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log("Listing Gemini models via v1beta...");
    try {
        const response = await fetch(`${GEMINI_BASE}/models?key=${apiKey}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("List Models Error Status:", response.status);
            console.error("List Models Error Data:", JSON.stringify(data, null, 2));
        } else {
            console.log("Available Models:");
            data.models?.forEach(m => console.log(` - ${m.name} (${m.displayName})`));
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

listModels();
