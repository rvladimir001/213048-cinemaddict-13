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

  getWatched(films) {
    return films.filter((film) => film.watched);
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
    const filteredFilms = this.filterFilms(films).slice();
    switch (sortType) {
      case `rating`:
        return filteredFilms.sort((a, b) => +a.rating > +b.rating ? 1 : -1);
      case `date`:
        return filteredFilms.sort((a, b) => {
          return +new Date(a.releaseFullDate) > +new Date(b.releaseFullDate) ? 1 : -1;
        });
    }
    return filteredFilms;
  }
}
