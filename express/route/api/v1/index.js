import express from "express";
import monitoring from "./monitoring";

const router = express.Router();

router.use("/monitoring", monitoring);

export default router;