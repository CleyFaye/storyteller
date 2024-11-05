import express from "express";
import api from "./api";
import app from "./app";

const router = express.Router();

router.use("/api", api);
router.use("/app", app);

export default router;