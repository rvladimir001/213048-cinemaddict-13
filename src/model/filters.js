import Observer from "../utils/observer";
import {FilterType} from "../utils/films";

export default class FiltersModel extends Observer {
  constructor() {
    super();
    this._filter = FilterType.ALL;
  }

  setFilter(filterType) {
    this._filter = filterType;
    this._notify();
  }

  getFilter() {
    return this._filter;
  }

  filterFilms(films) {
    switch (this._filter) {
      case FilterType.WATCHLIST:
        return films.filter((film) => film.watchlist);
      case FilterType.HISTORY:
        return films.filter((film) => film.watched);
      case FilterType.FAVORITES:
        return films.filter((film) => film.favorite);
    }
    return films;
  }

  sortFilms(films, sortType) {
    const filteredFilms = this.filterFilms(films);
    switch (sortType) {
      case `rating`:
        return filteredFilms.slice().sort((a, b) => a.rating > b.rating ? 1 : -1);
      case `date`:
        return filteredFilms.slice().sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1);
    }
    return filteredFilms;
  }
}
