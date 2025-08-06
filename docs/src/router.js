export const Router = {
  // initialize routes for the app
  routes: {},

  // set method to add new route with handler
  add(route, handler) {
    this.routes[route] = handler;
  },

  // set method to sent user to the path with calling its handler
  navigate(path) {
    if (this.routes[path]) {
      this.routes[path]();
      window.history.pushState({}, "", path);
    } else {
      console.error("Route not found:", path);
    }
  },
};
