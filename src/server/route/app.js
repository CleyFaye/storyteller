import {resolve as pathResolve} from "node:path";

import express from "express";

import {promiseHandler} from "../util/promise.js";

const router = express.Router();

router.get(
  "*",
  promiseHandler(
    (req, res) =>
      // eslint-disable-next-line promise/avoid-new
      new Promise((resolve) => {
        res.sendFile(pathResolve("dist/storyteller/index.html"), (err) => {
          if (err) {
            throw err;
          }
          resolve(null);
        });
      }),
  ),
);

export default router;
