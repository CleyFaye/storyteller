import express from "express";

import api from "./api/index.js";
import app from "./app.js";

const router = express.Router();

router.use("/api", api);
router.use("/app", app);

export default router;
