import Abstract from "./abstract";
import {timeFormatting} from "../utils/films";


export const createFilmCard = (film, countComments) => {
  const setClassActive = (status) => {
    return status ? `film-card__controls-item--active` : ``;
  };
  return (
    `<article class="film-card">
    <div class="film-card-active">
      <h3 class="film-card__title">${film.name}</h3>
      <p class="film-card__rating">${film.rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${film.releaseDate}</span>
        <span class="film-card__duration">${timeFormatting(film.runtime)}</span>
        <span class="film-card__genre">${film.genres[0]}</span>
      </p>
      <img src="${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description.slice(0, 65)}...</p>
      <a class="film-card__comments">${countComments} comments</a>
    </div>
    <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setClassActive(film.watchlist)}" type="button" name="watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setClassActive(film.watched)}" type="button" name="watched">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${setClassActive(film.favorite)}" type="button" name="favorite">Mark as favorite</button>
    </div>
  </article>`
  );
};

export class FilmCard extends Abstract {
  constructor(film, countComments) {
    super();
    this._film = film;
    this._countComments = countComments;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickHandlerEditStatus = this._clickHandlerEditStatus.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film, this._countComments);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-card-active`).addEventListener(`click`, this._clickHandler);
  }

  _clickHandlerEditStatus(evt) {
    evt.preventDefault();
    this._callback.editClick(evt);
  }

  setClickHandlerEditStatus(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, this._clickHandlerEditStatus);
  }
}
