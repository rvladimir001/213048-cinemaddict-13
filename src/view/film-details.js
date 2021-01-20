import Smart from "./smart";

const createFilmDetailsElement = (film) => {
  const createGenresTemlate = (genres) => {
    let genresTemlate = ``;
    for (const item of genres) {
      genresTemlate += `<span class="film-details__genre">${item}</span>`;
    }
    return genresTemlate;
  };
  const setCheckboxStatus = (status) => {
    return status ? `checked` : ``;
  };
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${film.poster}" alt="">
              <p class="film-details__age">${film.category}</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${film.name}</h3>
                  <p class="film-details__title-original">Original: ${film.name}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${film.rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${film.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${film.writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${film.actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${film.releaseFullDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${film.runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${film.country.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${createGenresTemlate(film.genres)}
                </tr>
              </table>
              <p class="film-details__film-description">
                ${film.description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${setCheckboxStatus(film.watchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setCheckboxStatus(film.watched)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched film-card__controls-item--active">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setCheckboxStatus(film.favorite)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="film-details__bottom-container"></div>
      </form>
    </section>`
  );
};

export class FilmDetailsElement extends Smart {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickHandlerEditStatus = this._clickHandlerEditStatus.bind(this);
    this._data = FilmDetailsElement.parseFilmToData(film);
    this._setControlHandlers();
  }

  getTemplate() {
    return createFilmDetailsElement(this._film);
  }

  restoreHandlers() {
    this._setControlHandlers();
    this.setClickHandler(this._callback.click);
    this.setClickHandlerEditStatus(this._callback.editClick);
  }


  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
  }

  _clickHandlerEditStatus(evt) {
    evt.preventDefault();
    let name = evt.target.getAttribute(`name`);
    console.log("name", name)
    this._callback.editClick(evt, FilmDetailsElement.parseDataToFilm(this._data));
    this.updateData({
      [name]: !this._film[name],
    });
  }

  setClickHandlerEditStatus(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, this._clickHandlerEditStatus);
  }

  _setControlHandlers() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
    for (let control of this.getElement().querySelectorAll(`.film-details__control-input`)) {
      control.addEventListener(`change`, this._clickHandlerEditStatus);
    }
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      favorite: film.favorite,
      watched: film.watched,
      watchlist: film.watchlist,
    });
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    delete data.favorite;
    delete data.watched;
    delete data.watchlist;
    return data;
  }
}
