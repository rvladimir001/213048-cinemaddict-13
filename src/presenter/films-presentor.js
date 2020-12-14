import {allFilmsForView} from "../mock/film";
import {closeFilmDetails, closeFilmDetailsEsc} from "../utils/films.js";
import {remove, render, RenderPosition} from "../utils/render";
import FilmCard from "../view/film-card";
import FilmDetailsElement from "../view/film-details";
import Comments from "../view/film-comments";
import ButtonShowMore from "../view/button-show-more";
import NoMoviesBlock from "../view/no-movies";

const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container) {
    this._container = container;
    this._containerFilms = container.querySelector(`.films-list__container`);
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._buttonShowMore = new ButtonShowMore();
  }

  init() {
    this._allFilmsForView = allFilmsForView.slice();
    this._renderFilmsBlock();
  }

  _renderFilmsList(count) {
    const firstFilm = this._allFilmsForView[0];
    for (let i = 0; i < count; i++) {
      const filmItem = this._allFilmsForView.pop();
      const card = new FilmCard(filmItem);
      render(this._containerFilms, card, RenderPosition.BEFOREEND);
      card.setClickHandler(() => this._showFilmDetails(firstFilm));
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
    render(this._containerFilms, new NoMoviesBlock(), RenderPosition.BEFOREEND);
  }

  _rendershowButton() {
    render(this._container, this._buttonShowMore, RenderPosition.BEFOREEND);
  }

  _showFilmDetails(film) {
    const filmDetails = new FilmDetailsElement(film);
    render(this._container, filmDetails, RenderPosition.BEFOREEND);
    const siteFilmComments = this._container.querySelector(`.film-details__bottom-container`);
    const commentsComponent = new Comments(film.comments);
    render(siteFilmComments, commentsComponent, RenderPosition.BEFOREEND);
    filmDetails.setClickHandler(() => closeFilmDetails(filmDetails, this._container));
    document.body.classList.add(`hide-overflow`);
    // commentsComponent._element.querySelector(`.film-details__controls`).addEventListener(`click`, (evt)=>{
    //   console.log( evt);
    // });
    //console.log('filmDetails', filmDetails.getElement().querySelector(`.film-details__controls`))
    filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        console.log(evt.target.id, film[evt.target.id]);
      }
    });
    document.addEventListener(`keydown`, (evt) => {
      closeFilmDetailsEsc(evt, filmDetails);
    });
  }
}
