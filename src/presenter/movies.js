import HeaderProfile from "../view/header-profile";
import {allFilmsForView} from "../mock/film";
import {filmsSort, closeFilmDetails, closeFilmDetailsEsc} from "../utils/films.js";

import ListEmpty from "../view/list-empty";
import {remove, render, RenderPosition} from "../utils/render";
import SortMenu from "../view/sort-menu";
import FooterStat from "../view/footer-stat";
import NoMoviesBlock from "../view/no-movies";
import FilmsContainer from "../view/films-container";
import FilmCard from "../view/film-card";
import FilmDetailsElement from "../view/film-details";
import Comments from "../view/film-comments";
import ButtonShowMore from "../view/button-show-more";

const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container) {
    this._containerHead = container.querySelector(`.header`);
    this._containerMain = container.querySelector(`.main`);
    this._containerBody = container.querySelector(`body`);
    this._containerFooter = container.querySelector(`footer`);
    this._headerProfileComponent = new HeaderProfile();
    this._filmsContainer = new FilmsContainer();
    this._sortMenu = new SortMenu();
    this._footerStat = new FooterStat(allFilmsForView.length);
    this._buttonShowMore = new ButtonShowMore();
    this._noMovies = new NoMoviesBlock();
    this._allFilmsForView = allFilmsForView;
  }

  init() {
    this._renderHeaderProfile();
    this._renderListEmpty();
    this._renderSortMenu();
    this._renderFilmsContainer();
    this._renderFilmsBlock();
    this._renderFooterStat();
  }

  _renderHeaderProfile() {
    render(this._containerHead, this._headerProfileComponent, RenderPosition.BEFOREEND);
  }

  _renderListEmpty() {
    const filmsSorted = this._filmsSort(this._allFilmsForView);
    render(this._containerMain, new ListEmpty(filmsSorted.watchlist.length, filmsSorted.history.length, filmsSorted.favorites.length), RenderPosition.BEFOREEND);
  }

  _filmsSort(listForSort) {
    return filmsSort(listForSort);
  }

  _renderFilmsContainer() {
    render(this._containerMain, this._filmsContainer, RenderPosition.BEFOREEND);
  }

  _renderSortMenu() {
    render(this._containerMain, this._sortMenu, RenderPosition.BEFOREEND);
  }

  _renderFilmsList(count) {
    const filmsList = this._containerMain.querySelector(`.films-list__container`);
    const firstFilm = this._allFilmsForView[0];
    for (let i = 0; i < count; i++) {
      const filmItem = this._allFilmsForView.pop();
      const card = new FilmCard(filmItem);
      render(filmsList, card, RenderPosition.BEFOREEND);
      card.setClickHandler(() => this._showFilmDetails(firstFilm));
    }
  }

  _renderFilmsBlock() {
    if (this._allFilmsForView.length > 0) {
      this._renderFilmsList(FILM_COUNT_FOR_LIST);
      this._rendershowButton();
      this._buttonShowMore.setClickHandler(() => {
        let countCardsForRender = FILM_COUNT_FOR_LIST;
        if (FILM_COUNT_FOR_LIST > this._allFilmsForView.length) {
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
    const siteFilmListElement = this._containerMain.querySelector(`.films-list__container`);
    render(siteFilmListElement, this._noMovies, RenderPosition.BEFOREEND);
  }

  _renderFooterStat() {
    render(this._containerFooter, this._footerStat, RenderPosition.BEFOREEND);
  }

  _rendershowButton() {
    render(this._containerMain, this._buttonShowMore, RenderPosition.BEFOREEND);
  }

  _showFilmDetails(film) {
    const filmDetails = new FilmDetailsElement(film);
    render(this._containerBody, filmDetails, RenderPosition.BEFOREEND);
    const siteFilmComments = this._containerBody.querySelector(`.film-details__bottom-container`);
    const commentsComponent = new Comments(film.comments);
    render(siteFilmComments, commentsComponent, RenderPosition.BEFOREEND);
    filmDetails.setClickHandler(() => closeFilmDetails(filmDetails, this._containerBody));
    this._containerBody.classList.add(`hide-overflow`);
    // commentsComponent._element.querySelector(`.film-details__controls`).addEventListener(`click`, (evt)=>{
    //   console.log( evt);
    // });
    //console.log('filmDetails', filmDetails.getElement().querySelector(`.film-details__controls`))
    filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        console.log(evt.target.id);
      }
    });
    document.addEventListener(`keydown`, (evt) => {
      closeFilmDetailsEsc(evt, filmDetails, this._containerBody);
    });
  }

}
