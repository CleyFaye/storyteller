import express from "express";
import monitoring from "./monitoring";
import close from "./close";
import project from "./project";
import setting from "./setting";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/close", close);
router.use("/project", project);
router.use("/setting", setting);

export default router;