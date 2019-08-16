import express from "express";
import monitoring from "./monitoring";
import close from "./close";
import project from "./project";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/close", close);
router.use("/project", project);

export default router;