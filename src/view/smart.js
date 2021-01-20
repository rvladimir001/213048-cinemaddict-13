import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._film = {};
  }

  updateData(date) {
    this._film = Object.assign({}, this._film, date);
    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }

  restoreHandlers() {}
}
