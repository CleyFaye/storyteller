import express from "express";
import {resolve as pathResolve} from "path";
import {promiseHandler} from "../util/promise";

const router = express.Router();

router.get("*", promiseHandler((req, res) => new Promise(resolve => {
  res.sendFile(pathResolve("dist/storyteller/index.html"), err => {
    if (err) {
      throw err;
    }
    resolve(null);
  });
})));

export default router;