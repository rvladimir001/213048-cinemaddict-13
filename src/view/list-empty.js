import Abstract from "./abstract";

const createListEmptyTemplate = (watchlistCount, HistoryCount, favoritesCount) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter="all">All movies</a>
        <a href="#watchlist" class="main-navigation__item" data-filter="watchlist">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
        <a href="#history" class="main-navigation__item" data-filter="history">History <span class="main-navigation__item-count">${HistoryCount}</span></a>
        <a href="#favorites" class="main-navigation__item" data-filter="favorites">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class ListEmpty extends Abstract {
  constructor() {
    super();
    this._watchlistCount = 0;
    this._HistoryCount = 0;
    this._favoritesCount = 0;
    this._clickHandler = this._clickHandler.bind(this);
  }

  setCounts(watchlistCount, HistoryCount, favoritesCount) {
    this._watchlistCount = watchlistCount;
    this._HistoryCount = HistoryCount;
    this._favoritesCount = favoritesCount;
  }

  getTemplate() {
    return createListEmptyTemplate(this._watchlistCount, this._HistoryCount, this._favoritesCount);
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
    for (let link of this.getElement().querySelectorAll(`.main-navigation__items`)) {
      link.addEventListener(`click`, this._clickHandler);
    }
  }
}
