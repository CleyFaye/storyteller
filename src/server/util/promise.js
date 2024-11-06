import HttpCodes from "@cley_faye/http-codes-consts";

import {apiReply, apiError} from "./api.js";

/** Convert a promise into an express handler.
 *
 * @param {function(req, res): Promise} promiseFunc
 * A function to handle the operation. This function must return a promise.
 * The return value (from the promise resolving) can be:
 * - undefined, which mean we didn't handle the request; the next handler will
 *   be called
 * - null, which mean the request was handled but nothing more have to be
 *   returned
 * - An object, in which case res.json() will be called on it
 * If either the function or the promise reject (or throws), the error is passed
 * down the handlers chain.
 *
 * @return {function}
 * The express handler.
 */
export const promiseHandler = (promiseFunc) => (req, res, next) => {
  (async () => {
    try {
      const handlerRes = await promiseFunc(req, res);
      if (handlerRes === undefined) {
        next();
      } else if (handlerRes !== null) {
        res.json(handlerRes);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      next(error);
    }
    // eslint-disable-next-line promise/prefer-await-to-then
  })().catch(() => {});
};

/** API handler as promise.
 *
 * Same as promiseHandler, but the return value is treated differently:
 * - If the promise fail, the request handling still stops here, an API error
 *   value is returned.
 * - If the promise succeed and return a value, it is wrapped as an API reply
 * - If the promise succeed with no return value, an empty reply is still
 *   constructed.
 */
export const APIHandler = (promiseFunc) =>
  promiseHandler(async (req, res) => {
    try {
      const handlerRes = await promiseFunc(req, res);
      return apiReply(handlerRes);
    } catch (error) {
      res.status(HttpCodes.INTERNAL_SERVER_ERROR);
      return apiError(
        error.code === undefined ? -1 : error.code,
        error.message === undefined ? "undefined error" : error.message,
      );
    }
  });
