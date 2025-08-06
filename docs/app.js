import { createElement } from "./src/createElement.js";
import { addEvent } from "./src/addEvent.js";
import { State } from "./src/State.js";
import { Router } from "./src/Router.js";

// initialize app state
State.setState({
  todos: [], // { id: int, text: string, state: 'active' | 'completed' }
  filter: "all", // 'all' | 'active' | 'completed'
  idCounter: 0, // count unique id for item
});

// initialize the app
(() => {
  // set routing
  Router.add("/", () => {
    State.setState({ filter: "all" });
    console.log(State.getState().todos);
  });
  Router.add("/active", () => {
    State.setState({ filter: "active" });
  });
  Router.add("/completed", () => {
    State.setState({ filter: "completed" });
  });

  // start the app
  State.subscribe(renderTodoApp);
  Router.navigate("/");
})();

// reflect status change
State.subscribe(toggleVisibility);
State.subscribe(createTodoItems);

// listen to hashchange
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1);
  Router.navigate(hash);
});

// FUNCTIONS ----------------------------------

function renderTodoApp() {
  const app = createElement("section", { class: "todoapp" }, [
    createHeader(), // input form
    createMain(), // todo list
    createFooter(), // control options
  ]);

  const root = document.getElementById("todoapp");
  root.innerHTML = "";
  root.appendChild(app);
}

// HEADER ---------------------

function createHeader() {
  const header = createElement("header", { class: "header" }, [
    createElement("h1", {}, ["todos"]), // app title
    createElement("input", {
      // todo input form
      class: "new-todo",
      placeholder: "What needs to be done?",
      autofocus: true,
    }),
  ]);

  // add event to header to create new todo-item
  addEvent(header.querySelector(".new-todo"), "keypress", (event) => {
    const currentState = State.getState();
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      const newTodo = {
        id: currentState.idCounter,
        text: event.target.value.trim(),
        state: "active",
      };
      State.setState({
        todos: [...currentState.todos, newTodo],
        idCounter: currentState.idCounter + 1,
      });
      event.target.value = "";
    }
  });

  return header;
}

// MAIN ----------------------

function createMain() {
  const main = createElement(
    "main",
    { class: "main", style: "display: none;" }, // hide as default
    [
      createElement("div", { class: "toggle-all-container" }, [
        createElement("input", { class: "toggle-all", type: "checkbox" }),
        createElement(
          "label",
          { class: "toggle-all-label", for: "toggle-all" },
          ["Mark all as complete"]
        ),
      ]),
      createElement("ul", { class: "todo-list" }, createTodoItems()),
    ]
  );

  return main;
}

function createTodoItems() {
  const todoItems = getFilteredTodos().map((todo, index) =>
    createElement(
      "li",
      {
        "data-id": todo.id,
        class: todo.state === "completed" ? "completed" : "",
      },
      [
        createElement("div", { class: "view" }, [
          createElement("input", {
            class: "toggle",
            type: "checkbox",
            ...(todo.state === "completed" && { checked: true }),
          }),
          createElement("label", {}, [todo.text]),
          createElement("button", { class: "destroy" }),
        ]),
      ]
    )
  );

  // add events to item
  todoItems.forEach((item, index) => {
    // add event to toggle item status
    const toggle = item.querySelector(".toggle");
    addEvent(toggle, "change", () => {
      const todoElement = event.target.closest("li");
      const elementId = todoElement.getAttribute("data-id");
      const updatedTodos = [...State.getState().todos];
      console.log(updatedTodos[elementId].state);
      updatedTodos[elementId].state =
        updatedTodos[elementId].state === "active" ? "completed" : "active";
      console.log(updatedTodos[elementId].state);
      State.setState({ todos: updatedTodos });
    });

    // add event to remove the item
    const destroy = item.querySelector(".destroy");
    addEvent(destroy, "click", (event) => {
      const todoElement = event.target.closest("li");
      const elementId = todoElement.getAttribute("data-id");
      const updatedTodos = State.getState().todos.map((todo, index) => {
        if (todo.id == elementId) {
          todo.state = "destroyed";
        }
        return todo;
      });
      State.setState({ todos: updatedTodos });
    });

    // add event for editing the todo text (on double-click)
    addEvent(item, "dblclick", (event) => {
      const label = item.querySelector("label");
      item.className = "editing";
      label.focus();
      const input = createElement("input", { class: "edit" });
      item.appendChild(input);
      const currentText = label.innerText;
      input.value = currentText;

      // Listen for the "Enter" key to save the changes
      addEvent(input, "keypress", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
          label.innerText = input.value.trim();
          const updatedTodos = State.getState().todos.map((todo, index) => {
            if (todo.id == item.getAttribute("data-id")) {
              todo.text = input.value.trim();
            }
            return todo;
          });
          State.setState({ todos: updatedTodos });
        }
      });

      // cancel the edit if the user clicks outside the input
      addEvent(document, "mousedown", (e) => {
        if (!item.contains(e.target)) {
          item.className = "";
          input.remove();
        }
      });
    });
  });

  return todoItems;
}

// FOOTER -----------------------

function createFooter() {
  const footer = createElement(
    "footer",
    { class: "footer", style: "display: none;" },
    [
      // active item counter
      createElement("span", { class: "todo-count" }, [
        createElement("strong", {}, [
          `${
            State.getState().todos.filter((todo) => todo.state === "active")
              .length
          }`,
        ]),
        " items left",
      ]),
      createFilters(),
      createElement(
        "button",
        { class: "clear-completed", style: "display: none;" },
        ["Clear completed"]
      ),
    ]
  );

  return footer;
}

function createFilters() {
  const { todos, filter } = State.getState();

  const filters = createElement("ul", { class: "filters" }, [
    createElement("li", {}, [
      createElement(
        "a",
        { href: "#/", class: filter === "all" ? "selected" : "" },
        ["All"]
      ),
    ]),
    createElement("li", {}, [
      createElement(
        "a",
        { href: "#/active", class: filter === "active" ? "selected" : "" },
        ["Active"]
      ),
    ]),
    createElement("li", {}, [
      createElement(
        "a",
        {
          href: "#/completed",
          class: filter === "completed" ? "selected" : "",
        },
        ["Completed"]
      ),
    ]),
  ]);

  return filters;
}

//  HELPER ---------------------------

function getFilteredTodos() {
  const { todos, filter } = State.getState();
  switch (filter) {
    case "active":
      return todos.filter((todo) => todo.state === "active");
    case "completed":
      return todos.filter((todo) => todo.state === "completed");
    default:
      return todos.filter((todo) => todo.state !== "destroyed");
  }
}

function toggleVisibility() {
  const { todos } = State.getState();

  // if there is any todo
  const main = document.querySelector(".main");
  const footer = document.querySelector(".footer");
  if (todos.length > 0) {
    main.style.display = "block";
    footer.style.display = "block";
  } else {
    main.style.display = "none";
    footer.style.display = "none";
  }

  // if there is any completed
  const completed = todos.filter((todo) => todo.state === "completed").length;
  const clearCompletedButton = document.querySelector(".clear-completed");
  if (completed > 0) {
    clearCompletedButton.style.display = "block";
    // add event to Clear Completed
    addEvent(clearCompletedButton, "click", () => {
      const updatedTodos = State.getState().todos.map((item) => {
        if (item.state === "completed") {
          item.state = "destroyed";
        }
        return item;
      });
      State.setState({ todos: updatedTodos });
    });
  } else {
    clearCompletedButton.style.display = "none";
  }
}
