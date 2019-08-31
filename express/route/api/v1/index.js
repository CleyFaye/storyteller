import express from "express";
import monitoring from "./monitoring";
import close from "./close";
import project from "./project";
import setting from "./setting";
import printer from "./printer";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/close", close);
router.use("/project", project);
router.use("/setting", setting);
router.use("/printer", printer);

export default router;