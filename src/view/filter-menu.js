import Abstract from "./abstract";

const createFilterMenuTemplate = (watchlistCount, historyCount, favoritesCount) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter="all">All movies</a>
        <a href="#watchlist" class="main-navigation__item" data-filter="watchlist">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
        <a href="#history" class="main-navigation__item" data-filter="history">History <span class="main-navigation__item-count">${historyCount}</span></a>
        <a href="#favorites" class="main-navigation__item" data-filter="favorites">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional" data-filter="stats">Stats</a>
    </nav>`
  );
};

export default class FilterMenu extends Abstract {
  constructor() {
    super();
    this._watchlistCount = 0;
    this._historyCount = 0;
    this._favoritesCount = 0;
    this._clickHandler = this._clickHandler.bind(this);
  }

  setCounts(watchlistCount, historyCount, favoritesCount) {
    this._watchlistCount = watchlistCount;
    this._historyCount = historyCount;
    this._favoritesCount = favoritesCount;
  }

  getTemplate() {
    return createFilterMenuTemplate(this._watchlistCount, this._historyCount, this._favoritesCount);
  }

  updateCountMenu() {
    this.getElement().querySelector(`a[data-filter="watchlist"] span`).textContent = this._watchlistCount;
    this.getElement().querySelector(`a[data-filter="history"] span`).textContent = this._historyCount;
    this.getElement().querySelector(`a[data-filter="favorites"] span`).textContent = this._favoritesCount;
  }

  getActiveLink() {
    return super.getElement().querySelector(`.main-navigation__item--active`);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this.getActiveLink().classList.remove(`main-navigation__item--active`);
    evt.target.classList.add(`main-navigation__item--active`);
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    for (const link of this.getElement().querySelectorAll(`.main-navigation__items`)) {
      link.addEventListener(`click`, this._clickHandler);
    }
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._clickHandler);
  }
}
