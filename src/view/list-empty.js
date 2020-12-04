import {createElement} from "../utils";

const createListEmptyTemplate = (watchlistCount, HistoryCount, favoritesCount) => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${HistoryCount}</span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class ListEmpty {
  constructor(watchlistCount, HistoryCount, favoritesCount) {
    this._element = null;
    this._watchlistCount = watchlistCount;
    this._HistoryCount = HistoryCount;
    this._favoritesCount = favoritesCount;
  }

  getTemplate() {
    return createListEmptyTemplate(this._watchlistCount, this._HistoryCount, this._favoritesCount);
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
