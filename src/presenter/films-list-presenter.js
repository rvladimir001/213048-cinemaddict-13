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
    this._countFilmsForView = null;
  }

  init() {
    this._allFilmsForView = this._allFilms.slice();
    this._countFilmsForView = 0;
    this._renderFilmsBlock();
  }

  _renderFilmsList(start, end) {
    for (let i = start; i < end; i++) {
      this._cardFilmComponent = new FilmCardView(this._allFilmsForView[i]);
      render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
      this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(i));
      this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, i));
    }
  }

  _renderFilmsBlock() {
    const filmsCount = this._allFilmsForView.length;
    if (filmsCount > 0) {
      this._renderFilmsList(0, this._renderFilmsCount);
      this._renderShowButton();
      let countCardsForRender = null;
      this._buttonShowMore.setClickHandler(() => {
        countCardsForRender = this._renderFilmsCount;
        this._countFilmsForView = this._countFilmsForView + countCardsForRender;
        if (filmsCount - (this._countFilmsForView) < this._renderFilmsCount) {
          countCardsForRender = filmsCount - this._countFilmsForView;
        }
        this._renderFilmsList(this._countFilmsForView, this._countFilmsForView + countCardsForRender);
        if (filmsCount === this._countFilmsForView + countCardsForRender) {
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

  _showFilmDetails(index) {
    if (this._countCardInPage !== 0) {
      this._renderFilmsCount = this._countCardInPage;
    }
    if (this._filmDetailsStatus) {
      this._filmDetailsStatus = false;
      this._renderFilmDetails(index);
    } else {
      this._filmDetailsStatus = false;
      remove(this._filmDetails);
      this._renderFilmDetails(index);
    }
  }

  _renderFilmDetails(index) {
    this._filmDetails = new FilmDetailsElementView(this._allFilmsForView[index]);
    this._comments = new CommentsView(this._allFilmsForView[index].comments);
    render(document.body, this._filmDetails, RenderPosition.BEFOREEND);
    render(this._filmDetails, this._comments, RenderPosition.BEFOREEND);
    this._filmDetails.setClickHandler(() => this._close());
    document.addEventListener(`keydown`, (evt) => {
      this._closeEsc(evt, this._filmDetails);
    });

    this._filmDetails.setClickHandlerEditStatus((evt) => {
      this._editFilm(evt, index);
    });
  }

  _editFilm(evt, index) {
    if (evt.target.tagName === `INPUT` || evt.target.tagName === `BUTTON`) {
      this._changeData(Object.assign({}, this._allFilmsForView[index], {[evt.target.name]: !this._allFilmsForView[index][evt.target.name]}));
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
