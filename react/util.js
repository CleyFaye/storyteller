/*eslint-env browser */

/** Dynamically add a CSS to the current document
 * 
 * @param {string} path
 * 
 * @return {Element}
 * The element (for future removal).
 * You can call "remove()" on this object to unload it.
 */
export const loadCSS = href => {
  const res = document.createElement("link");
  res.rel = "stylesheet";
  res.href = href;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(res);
  return res;
};