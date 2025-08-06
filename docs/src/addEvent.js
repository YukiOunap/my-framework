export function addEvent(element, eventType, handler) {
  // set unique property name
  const eventHandlerKey = `__handlers_${eventType}`;

  // add new handler to the event property if it already exists
  if (element[eventHandlerKey]) {
    element[eventHandlerKey].push(handler);
    return;
  }

  // make the event property if it doesn't exist yet
  element[eventHandlerKey] = [];

  // set the function to call all handlers in the event property
  const originalHandler = (event) => {
    element[eventHandlerKey].forEach((fn) => fn(event));
  };

  // add new handler to the event property if the event type is supported
  const eventPropertyKey = `on${eventType}`;
  if (typeof element[eventPropertyKey] !== "undefined") {
    element[eventPropertyKey] = originalHandler;
    element[eventHandlerKey].push(handler);
    return;
  }

  // show warning if the event type is not supported
  console.warn(`Event type ${eventType} not directly supported`);
}
