import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-2.5-flash-lite";

async function test() {
    console.log("Testing model:", model);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Hi" }] }] })
        });
        const data = await response.json();
        if (!response.ok) {
            console.log("Error:", JSON.stringify(data, null, 2));
        } else {
            console.log("Success:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
test();
