import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import diagnoseRoutes from "./app/routes/diagnose.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", diagnoseRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));

// // First API call with reasoning
// let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // use env variable
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     model:"google/gemma-3-4b-it:free",
//     messages: [
//       {
//         role: "user",
//         content: "How many r's are in the word 'strawberry'?"
//       }
//     ],
//     reasoning: { enabled: true }
//   })
// });

// // Extract the assistant message with reasoning_details
// console.log("wait.....")
// const result = await response.json();
// console.log(result)
// response = result.choices[0].message;

// // Preserve the assistant message with reasoning_details
// const messages = [
//   {
//     role: "user",
//     content: "How many r's are in the word 'strawberry'?",
//   },
//   {
//     role: "assistant",
//     content: response.content,
//     reasoning_details: response.reasoning_details, // pass as-is
//   },
//   {
//     role: "user",
//     content: "Are you sure? Think carefully.",
//   },
// ];

// // Second API call
// console.log("wait2.....")
// const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//   method: "POST",
//   headers: {
//     "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     model: "google/gemma-3-4b-it:free",
//     messages: messages
//   })
// });

// // Get final response
// const result2 = await response2.json();
// console.log("final result",result2.choices[0].message);




// controllers/diagnosisController.js

// const fetch = require("node-fetch");
