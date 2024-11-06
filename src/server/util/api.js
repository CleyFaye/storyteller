/** Wrap an API reply with proper error information.
 *
 * This is for successful calls with no error.
 *
 * @param {Object} data
 * The actual reply data.
 *
 * @return {Object}
 * The wrapped reply.
 */
export const apiReply = (data) => ({
  data: data || null,
  error: 0,
  message: "ok",
});

/** Wrap an API reply with proper error information.
 *
 * This is for failed calls, to display an error message to the user.
 *
 * @param {number} code
 * The error code.
 *
 * @param {string} message
 * The message to display to the user.
 */
export const apiError = (code, message) => ({
  data: null,
  error: code,
  message,
});

/** Throw an exception that includes an arbitrary error code
 *
 * @param {number} code
 * @param {string} message
 */
export const APIError = (errData) => {
  const error = new Error(errData.message);
  error.code = errData.code;
  error.httpCode = errData.http;
  return error;
};

/** List of known error codes */
export const errorCodes = {
  PROJECT_ENOENT: {
    code: "1",
    http: 500,
    message: "Project file not found",
  },
};
