import express from "express";
import listExisting from "./listexisting";

const router = express.Router();

router.use("/listExisting", listExisting);

export default router;