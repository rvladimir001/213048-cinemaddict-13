import Abstract from "./abstract";

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort="default">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort="date">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort="rating">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortMenu extends Abstract {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  getActiveLink() {
    return super.getElement().querySelector(`.sort__button--active`);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.getActiveLink().classList.remove(`sort__button--active`);
    evt.target.classList.add(`sort__button--active`);
    this._callback.click(evt);
  }

  setDefault() {
    this.getActiveLink().classList.remove(`sort__button--active`);
    this.getElement().querySelector(`a[data-sort="default"]`).classList.add(`sort__button--active`);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (const botton of this.getElement().querySelectorAll(`.sort__button`)) {
      botton.addEventListener(`click`, this._clickHandler);
    }
  }
}
