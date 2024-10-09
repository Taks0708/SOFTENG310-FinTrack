const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cleanResponse } = require("../services/responseCleaner.js"); // Importing from backend services
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

exports.getResponseForPrompt = async (req, res) => {
    const { prompt } = req.body;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                // candidateCount: 1,
                // stopSequences: ["x"],
                // maxOutputTokens: 20,
                temperature: 1.0,
            },
        });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const cleanedResponse = cleanResponse(text);
        res.send({ success: true, response: cleanedResponse });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).send({ success: false, error: "Something went wrong" });
    }
};

exports.getLuckyAdvice = async (req, res) => {
    // adjust prompt message for I'm feeling lucky button
    const prompt = `
    Give 1 financial tip/advice/information that users can expand their knowledge on over time.
    The response should include:
    1. **Title**
    A clear title for the tip.
    2. **Content**
    Detailed explanation or advice regarding the tip.

    Make sure to format the response clearly, using double asterisks to denote section headings.
    `;
    // 3. **Source**
    // A reliable source where this information can be found.
    // 4. **Related Links**
    // A list of relevant links to websites related to the financial information provided.

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const cleanedResponse = cleanResponse(text);
        res.send({ success: true, response: cleanedResponse });
    } catch (error) {
        console.error("Error generating lucky advice:", error);
        res.status(500).send({ success: false, error: "Something went wrong" });
    }
};
