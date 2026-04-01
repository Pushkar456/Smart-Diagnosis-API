import Diagnosis from "../models/Diagnosis.js";
import { OpenRouter } from '@openrouter/sdk';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Basic fallback rule-based logic
const basicRules = (symptoms) => {
  const s = symptoms.toLowerCase();
  const results = [];

  if (s.includes("fever") && s.includes("cough")) {
    results.push({ condition: "Flu", probability: "70%", nextSteps: "Consult general physician" });
  }

  if (s.includes("chest pain")) {
    results.push({ condition: "Cardiac Issue", probability: "60%", nextSteps: "ECG + Cardiologist" });
  }

  return results;
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const getDiagnosis = async (req, res) => {
  try {
    const { symptoms, age, gender, duration } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    // 🔥 Strong system prompt (VERY IMPORTANT)
    const systemPrompt = `
You are a medical assistant AI.

Your job:
- Analyze patient symptoms
- Suggest possible conditions with probability (%)
- Provide at least 2 possible diagnoses
- Suggest next best steps (tests, doctor type, care advice)

Rules:
- Be concise but informative
- Do NOT give extreme or dangerous advice
- Always include a disclaimer: "Consult a qualified doctor"
- Output STRICT JSON format

Format:
{
  "possible_conditions": [
    {
      "name": "Condition name",
      "probability": "XX%",
      "reason": "Why this condition matches symptoms"
    }
  ],
  "recommended_steps": [
    "Step 1",
    "Step 2"
  ],
  "severity": "Low | Medium | High",
  "disclaimer": "Consult a qualified doctor"
}
`;

    const userPrompt = `
Patient Details:
- Age: ${age || "Unknown"}
- Gender: ${gender || "Unknown"}
- Symptoms: ${symptoms}
- Duration: ${duration || "Unknown"}

Provide diagnosis.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
       messages: [
  {
    role: "user",
    content: `
${systemPrompt}

${userPrompt}
    `
  }
],
        temperature: 0.3
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        error: data.error.message,
        details: data.error
      });
    }

    const output = data.choices[0].message.content;
    // console.log(output)
    // Try parsing JSON safely
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      parsed = { raw: output }; // fallback if model breaks format
    }

    res.json({
      success: true,
      diagnosis: parsed
    });

  } catch (error) {
    console.error("Diagnosis Error:", error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};




export const getHistory = async (req, res) => {
  try {
    const history = await Diagnosis.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
