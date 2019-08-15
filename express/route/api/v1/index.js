import express from "express";
import monitoring from "./monitoring";
import project from "./project";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/project", project);

export default router;