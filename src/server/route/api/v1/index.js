import express from "express";

import close from "./close.js";
import font from "./font.js";
import monitoring from "./monitoring.js";
import printer from "./printer.js";
import project from "./project/index.js";
import setting from "./setting.js";
import theme from "./theme.js";

const router = express.Router();

router.use("/monitoring", monitoring);
router.use("/close", close);
router.use("/project", project);
router.use("/setting", setting);
router.use("/printer", printer);
router.use("/theme", theme);
router.use("/font", font);

export default router;
