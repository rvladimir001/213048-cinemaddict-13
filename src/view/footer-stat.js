import {createElement} from "../utils";

const createFooterStat = (n)=> {
  return (`${n}`);
};

export default class FooterStat {
  constructor(n) {
    this._element = null;
    this._n = n;
  }

  getTemplate() {
    return createFooterStat(this._n);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
