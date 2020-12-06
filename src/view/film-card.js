import Abstract from "./abstract";

export const createFilmCard = (film) => {
  const setСlassActive = (status) => {
    return status ? `film-card__controls-item--active` : ``;
  };
  return (
    `<article class="film-card">
    <h3 class="film-card__title">${film.name}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.releaseDate.getFullYear()}</span>
      <span class="film-card__duration">${film.runtime}</span>
      <span class="film-card__genre">${film.genres[0]}</span>
    </p>
    <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.description.slice(0, 65)}...</p>
    <a class="film-card__comments">${film.comments.length} comments</a>
    <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setСlassActive(film.historyStatus)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setСlassActive(film.watchlistStatus)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${setСlassActive(film.favoritesStatus)}" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
