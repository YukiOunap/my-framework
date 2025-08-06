# My-Framework

This framework provides a simple and lightweight approach to building web applications with custom routing, event handling, state management, and dynamic element creation. It contains four core components: `addEvent.js`, `createElement.js`, `router.js`, and `state.js` in `docs/src` directory.

The `docs` directory contains a sample todoMVC project implemented by this framework.

# Sample App: todoMVC

A simple project implemented by this framework.

You can try the app here: https://yukiounap.github.io/my-framework/

# Framework Details

- **Dynamic Element Creation**: Easily create HTML elements with attributes and children.
- **Custom Event Handling**: Attach multiple event listeners to elements and manage them efficiently.
- **Routing**: Implement simple client-side routing to navigate between different parts of your application without page reloads.
- **State Management**: Centralized state management system to keep track of your application's state and notify components of state changes.

## Code Examples and Explanations

### 1. Creating Elements with Attribute and Nested Children

The `createElement` function allows you to create an HTML element with specific attributes and nested children. This makes it easy to generate DOM elements dynamically.

#### Example

```javascript
import { createElement } from "/src/createElement.js";

// Create a div element with a class
const container = createElement("div", { class: "container" }, [
  // Create an h1 element with text
  createElement("h1", {}, ["Welcome to the App"]),

  // Create a p element with text
  createElement("p", {}, [
    "This application is built using a simple framework.",
  ]),

  // Create a ul element with some li items
  createElement("ul", {}, [
    createElement("li", {}, ["Item 1"]),
    createElement("li", {}, ["Item 2"]),
    createElement("li", {}, ["Item 3"]),
  ]),
]);

// Append the container div to the document body
document.body.appendChild(container);
```

Here's the created elements:

```html
<div class="container">
  <h1>Welcome to the App</h1>
  <p>This application is built using a simple framework.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

#### Explanation:

- **Tag**: The type of element (e.g., div, button, p).
- **Attributes**: An object where the keys are attribute names and the values are the corresponding attribute values (e.g., { class: 'my-class' }).
- **Children**: An array of child elements or text nodes that will be nested inside the created element.

### 2. Creating an Event

The `addEvent` function allows you to attach event listeners to DOM elements. It supports adding multiple listeners to the same event type.

#### Example

```javascript
import { addEvent } from "/src/addEvent.js";

// Create a button element
const button = createElement("button", {}, ["Click me"]);

// Add a click event listener to the button
addEvent(button, "click", () => {
  console.log("Button clicked!");
});

// Append the button to the document body
document.body.appendChild(button);
```

#### Explanation:

The addEvent function attaches a click event handler to the button element. Multiple event handlers can be added to the same event type.

## How the Framework Works

### Element Creation (`createElement.js`)

The createElement function creates DOM elements dynamically, accepts attributes as an object, and appends children (either strings or elements) to the created element. This provides a clean and flexible API to build complex HTML structures.

### Event Handling (`addEvent.js`)

The addEvent function ensures that multiple event handlers can be attached to the same event type. It uses a unique property name (e.g., `__handlers_click`) to store event handlers for each event type on the element. This allows for efficient management of event listeners and prevents overwriting of existing event handlers.

### Routing (`router.js`)

The Router object allows you to manage client-side routing. Routes are defined with a path and a handler, and the navigate method changes the browser's URL and calls the appropriate route handler. This enables single-page application (SPA) behavior, where the content dynamically changes without a full page reload.

### State Management (`state.js`)

The State object acts as a centralized store for your application's state. It provides methods to get and set state, and automatically notifies listeners when the state changes. This ensures that your application is reactive, and components can subscribe to state changes to update the UI accordingly.

## Why Things Work the Way They Work

### Centralized Event Handling

By storing event handlers in a custom property on the element, we avoid conflicts with existing event handlers and ensure that all registered handlers are called when the event is triggered. This provides flexibility in managing multiple handlers.

### Dynamic Element Creation

The `createElement` function abstracts away the complexity of manually creating elements and adding attributes or children, which simplifies the process of building the DOM in a programmatic way. This makes it easier to build user interfaces dynamically.

### Client-Side Routing

The routing mechanism uses hash-based navigation (#) to manage state transitions without causing full page reloads. This is common in SPAs, where the URL reflects the current state of the application without refreshing the entire page.

### Reactivity and State Management

The state management system enables a reactive UI by ensuring that all components that are subscribed to the state are automatically updated whenever the state changes. This is a fundamental concept in modern frontend frameworks.