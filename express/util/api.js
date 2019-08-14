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
export const apiReply = data => ({
  error: 0,
  message: "ok",
  data: data || null,
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
  error: code,
  message,
  data: null,
});

/** Throw an exception that includes an arbitrary error code
 * 
 * @param {number} code
 * @param {string} message
 */
export const APIError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};