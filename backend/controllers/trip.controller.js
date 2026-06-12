const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateTrip = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Gemini API key is not configured" });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error generating trip with Gemini:", error);
    return res.status(500).json({ error: "Failed to generate trip", details: error.message });
  }
};

module.exports = {
  generateTrip
};
