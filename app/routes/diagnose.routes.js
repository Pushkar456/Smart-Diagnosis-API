import express from "express";
import {  getHistory,getDiagnosis } from "../controllers/diagnose.controller.js";

const router = express.Router();

router.post("/diagnose", getDiagnosis);
router.get("/history", getHistory);

export default router