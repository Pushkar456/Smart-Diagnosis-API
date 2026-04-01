import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  symptoms: String,
  result: Array,
}, { timestamps: true });

export default mongoose.model("Diagnosis", diagnosisSchema);

