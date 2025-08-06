export const State = {
  // initialize state for the app
  state: {},

  // set method to get current state
  getState() {
    return this.state;
  },

  // set method to set new state
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  },

  // set list to manage listeners to listen to updates
  listeners: [],

  // set method to add new listener
  subscribe(listener) {
    this.listeners.push(listener);
  },

  // set method to call listeners
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  },
};
