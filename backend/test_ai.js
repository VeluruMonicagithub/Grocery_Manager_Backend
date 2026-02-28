import dotenv from "dotenv";
dotenv.config();

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = "gemini-flash-latest";
const apiKey = process.env.GEMINI_API_KEY;

async function testGemini() {
    console.log("Testing Gemini API with model:", GEMINI_MODEL);
    console.log("API Key present:", !!apiKey);

    try {
        const response = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Hello!" }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Gemini API Error Status:", response.status);
            console.error("Gemini API Error Data:", JSON.stringify(data, null, 2));
        } else {
            console.log("Gemini API Success Response:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

testGemini();
