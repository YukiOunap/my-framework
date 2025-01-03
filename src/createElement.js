export function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);

  // set attribute
  for (let [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }

  // add children
  children.forEach((child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  return element;
}
