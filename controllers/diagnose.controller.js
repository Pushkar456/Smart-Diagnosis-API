import Diagnosis from "../models/Diagnosis.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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


export const diagnose = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    let aiResponse;

    try {
      const prompt = `You are a medical assistant. Given symptoms, return 2-3 possible conditions in STRICT JSON format like:
[
  { "condition": "", "probability": "", "nextSteps": "" }
]

Symptoms: ${symptoms}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Clean possible markdown formatting
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const saved = await Diagnosis.create({
        symptoms,
        result: parsed
      });

      return res.json(parsed);

    } catch (err) {
      console.log("AI failed, using fallback");

      const fallback = basicRules(symptoms);

      const saved = await Diagnosis.create({
        symptoms,
        result: fallback
      });

      return res.json(fallback);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
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
