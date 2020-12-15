import FilmCard from "../view/film-card";
import {render, RenderPosition, remove} from "../utils/render";
import FilmDetailsElement from "../view/film-details";
import Comments from "../view/film-comments";
import {closeFilmDetails, closeFilmDetailsEsc} from "../utils/films";

export default class Film {
  constructor(container) {
    this._container = container;
    this._filmDetails = null;
    this._comments = null;
  }

  init(filmItem) {
    this._filmItem = filmItem;
    const card = new FilmCard(this._filmItem);
    render(this._container, card, RenderPosition.BEFOREEND);
    card.setClickHandler(() => this._showFilmDetails(this._filmItem));
  }

  _showFilmDetails(film) {
    //TODO детализация по фильму открывается только один раз
    // - remove не отрабатывает?
    const prevFilmDetails = this._filmDetails;
    const prevComments = this._comments;

    this._filmDetails = new FilmDetailsElement(film);
    this._comments = new Comments(film.comments);

    if (prevFilmDetails === null || prevComments === null) {
      render(this._container, this._filmDetails, RenderPosition.BEFOREEND);

      const siteFilmComments = this._container.querySelector(`.film-details__bottom-container`);

      render(siteFilmComments, this._comments, RenderPosition.BEFOREEND);

      this._filmDetails.setClickHandler(() => closeFilmDetails(this._filmDetails, this._container));
      document.body.classList.add(`hide-overflow`);
      //TODO тут пытаюсь обработать клики по Add to watchlist, Already watched, Add to favorites..
      // this._filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, (evt) => {
      //   if (evt.target.tagName === `INPUT`) {
      //     console.log(evt.target.id, film[evt.target.id]);
      //   }
      // });
      document.addEventListener(`keydown`, (evt) => {
        closeFilmDetailsEsc(evt, this._filmDetails);
      });
      return;
    }
    remove(prevFilmDetails);
    remove(prevComments);
  }
}
