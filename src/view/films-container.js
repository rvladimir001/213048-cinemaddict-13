import {createElement} from "../utils";

const createFilmsContainer = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <div class="films-list__container"><div>
      </section class="films">
    </section class="films-list">`
  );
};

export default class FilmsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsContainer();
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
