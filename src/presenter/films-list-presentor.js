import {allFilmsForView} from "../mock/film";
import {remove, render, RenderPosition} from "../utils/render";
import ButtonShowMore from "../view/button-show-more";
import NoMoviesBlock from "../view/no-movies";
import Film from "./film-presenrot";

const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container) {
    this._container = container;
    this._containerFilms = container.querySelector(`.films-list__container`);
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._buttonShowMore = new ButtonShowMore();
    this._nomovies = new NoMoviesBlock();
    this._filmPresenter = {};
  }

  init() {
    this._allFilmsForView = allFilmsForView.slice();
    this._renderFilmsBlock();
  }

  _renderFilmsList(count) {
    for (let i = 0; i < count; i++) {
      const filmItem = this._allFilmsForView.pop();
      this._filmPresenter = new Film(this._containerFilms);
      this._filmPresenter.init(filmItem);
    }
  }

  _renderFilmsBlock() {
    if (this._allFilmsForView.length > 0) {
      this._renderFilmsList(this._renderFilmsCount);
      this._rendershowButton();
      this._buttonShowMore.setClickHandler(() => {
        let countCardsForRender = this._renderFilmsCount;
        if (this._renderFilmsCount > this._allFilmsForView.length) {
          countCardsForRender = this._allFilmsForView.length;
        }
        this._renderFilmsList(countCardsForRender);
        if (this._allFilmsForView.length === 0) {
          remove(this._buttonShowMore);
        }
      });
    } else {
      this._renderNoMoviesBlock();
    }
  }

  _renderNoMoviesBlock() {
    render(this._containerFilms, this._nomovies, RenderPosition.BEFOREEND);
  }

  _rendershowButton() {
    render(this._container, this._buttonShowMore, RenderPosition.BEFOREEND);
  }
}
