import {remove, render, RenderPosition, updateItem} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetailsElement as FilmDetailsElementView} from "../view/film-details";
import {Comments as CommentsView} from "../view/film-comments";
import {closeFilmDetails, closeFilmDetailsEsc} from "../utils/films";

const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, allFilms) {
    this._container = container;
    this._containerFilms = container.querySelector(`.films-list__container`);
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._buttonShowMore = new ButtonShowMoreView();
    this._nomovies = new NoMoviesBlockView();
    this._filmDetailsStatus = true;
    this._filmDetails = null;
    this._allFilms = allFilms;
    this._allFilmsForView = null;
    this._countCardInPage = 5;
  }

  init() {
    this._allFilmsForView = this._allFilms.slice();
    this._renderFilmsBlock();
  }

  _renderFilmsList(count) {
    for (let i = 0; i < count; i++) {
      let filmItem = this._allFilmsForView.pop();
      this._cardFilmComponent = new FilmCardView(filmItem);
      render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
      this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(filmItem));
      this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, filmItem));
    }
  }

  _renderFilmsBlock() {
    if (this._allFilmsForView.length > 0) {
      this._renderFilmsList(this._renderFilmsCount);
      this._renderShowButton();
      let countCardsForRender = null;
      this._buttonShowMore.setClickHandler(() => {
        countCardsForRender = this._renderFilmsCount;
        if (this._renderFilmsCount > this._allFilmsForView.length) {
          countCardsForRender = this._allFilmsForView.length;
        }
        this._renderFilmsList(countCardsForRender);
        if (this._allFilmsForView.length === 0) {
          remove(this._buttonShowMore);
        }
        this._countCardInPage += countCardsForRender;
      });
    } else {
      this._renderNoMoviesBlock();
    }
  }

  _renderNoMoviesBlock() {
    render(this._containerFilms, this._nomovies, RenderPosition.BEFOREEND);
  }

  _renderShowButton() {
    render(this._container, this._buttonShowMore, RenderPosition.BEFOREEND);
  }

  _showFilmDetails(filmItem) {
    if (this._countCardInPage !== 0) {
      this._renderFilmsCount = this._countCardInPage;
    }
    if (this._filmDetailsStatus) {
      this._filmDetailsStatus = false;
      this._renderFilmDetails(filmItem);
    } else {
      this._filmDetailsStatus = false;
      remove(this._filmDetails);
      this._renderFilmDetails(filmItem);
    }
  }

  _renderFilmDetails(filmItem) {
    this._filmDetails = new FilmDetailsElementView(filmItem);
    this._comments = new CommentsView(filmItem.comments);
    render(document.body, this._filmDetails, RenderPosition.BEFOREEND);
    render(this._filmDetails, this._comments, RenderPosition.BEFOREEND);
    this._filmDetails.setClickHandler(() => this._close());
    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, (evt) => {
      this._closeEsc(evt, this._filmDetails);
    });
    this._filmDetails.setClickHandlerEditStatus((evt) => this._editFilm(evt, filmItem));
  }

  _editFilm(evt, filmItem) {
    if (evt.target.tagName === `INPUT` || evt.target.tagName === `BUTTON`) {
      this._changeData(Object.assign({}, filmItem, {[evt.target.name]: !filmItem[evt.target.name]}));
    }
  }

  _changeData(updatedFilm) {
    this._allFilms = updateItem(this._allFilms, updatedFilm);
    this._clearFilmList();
    this.init();
  }

  _close() {
    closeFilmDetails(this._filmDetails, this._containerFilms);
    remove(this._filmDetails);
    this._filmDetailsStatus = true;
  }

  _closeEsc(evt) {
    closeFilmDetailsEsc(evt, this._filmDetails);
    remove(this._filmDetails);
    this._filmDetailsStatus = true;
  }

  _clearFilmList() {
    while (this._containerFilms.firstChild) {
      this._containerFilms.removeChild(this._containerFilms.firstChild);
    }
  }
}
