let serverRef = null;

/** Store the server instance for closing it later.
 * 
 * @param {Object} ref
 * The server instance
 */
export const setRef = ref => serverRef = ref;

/** Close the stored server reference */
export const closeServer = () => {
  if (serverRef) {
    serverRef.close();
    serverRef = null;
  }
};