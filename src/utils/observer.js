export default class Observer {
  constructor() {
    this._observers = [];
  }

  _notify(evt, payload) {
    this._observers.forEach((observer) => observer(evt, payload));
  }
}
