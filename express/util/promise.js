import {apiReply} from "./api";
import {apiError} from "./api";

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
export const promiseHandler = promiseFunc => (req, res, next) => {
  promiseFunc(req, res).then(result => {
    if (result === undefined) {
      next();
    } else if (result !== null) {
      res.json(result);
    }
  }).catch(error => {
    console.error(error);
    next(error);
  });
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
export const APIHandler = promiseFunc =>
  promiseHandler(
    (req, res) => promiseFunc(
      req,
      res
    ).then(
      result => apiReply(result)
    ).catch(
      error => apiError(
        error.code === undefined ? -1 : error.code,
        error.message === undefined ? "undefined error" : error.message
      )
    )
  );