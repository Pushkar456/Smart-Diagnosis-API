import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import diagnoseRoutes from "./routes/diagnose.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", diagnoseRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));

