import express from "express";
import { diagnose, getHistory } from "../controllers/diagnose.controller.js";

const router = express.Router();

router.post("/diagnose", diagnose);
router.get("/history", getHistory);