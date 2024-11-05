import express from "express";
import monitoring from "./monitoring";
import close from "./close";
import project from "./project";
import setting from "./setting";
import printer from "./printer";
import theme from "./theme";
import font from "./font";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/close", close);
router.use("/project", project);
router.use("/setting", setting);
router.use("/printer", printer);
router.use("/theme", theme);
router.use("/font", font);

export default router;