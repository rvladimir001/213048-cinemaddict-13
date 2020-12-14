import FilmCard from "../view/film-card";
import {render, RenderPosition} from "../utils/render";
import FilmDetailsElement from "../view/film-details";
import Comments from "../view/film-comments";
import {closeFilmDetails, closeFilmDetailsEsc} from "../utils/films";

export default class Film {
  constructor(container) {
    this._container = container;
  }

  init(filmItem) {
    this._renderFilm(filmItem);
  }

  _renderFilm(filmItem) {
    const card = new FilmCard(filmItem);
    render(this._container, card, RenderPosition.BEFOREEND);
    card.setClickHandler(() => this._showFilmDetails(filmItem));
  }

  _showFilmDetails(film) {
    const filmDetails = new FilmDetailsElement(film);
    render(this._container, filmDetails, RenderPosition.BEFOREEND);
    const siteFilmComments = this._container.querySelector(`.film-details__bottom-container`);
    const commentsComponent = new Comments(film.comments);
    render(siteFilmComments, commentsComponent, RenderPosition.BEFOREEND);
    filmDetails.setClickHandler(() => closeFilmDetails(filmDetails, this._container));
    document.body.classList.add(`hide-overflow`);
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
