import ListEmpty from "./view/list-empty.js";
import HeaderProfile from "./view/header-profile.js";
import SortMenu from "./view/sort-menu.js";
import FilmsContainer from "./view/films-container.js";
import NoMoviesBlock from "./view/no-movies.js";
import FilmCard from "./view/film-card.js";
import ButtonShowMore from "./view/button-show-more.js";
import FooterStat from "./view/footer-stat.js";
import FilmDetailsElement from "./view/film-details.js";
import Comments from "./view/film-comments.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {filmsSort, closeFilmDetails, closeFilmDetailsEsc} from "./utils/films.js";
import {allFilmsForView} from "./mock/film";

const FILM_COUNT_FOR_LIST = 5;


const filmsSorted = filmsSort(allFilmsForView);

const showFilmDetails = (film, siteBody) => {
  const filmDetails = new FilmDetailsElement(film);
  render(siteBodyElement, filmDetails, RenderPosition.BEFOREEND);
  const siteFilmComments = siteBodyElement.querySelector(`.film-details__bottom-container`);
  render(siteFilmComments, new Comments(film.comments), RenderPosition.BEFOREEND);
  filmDetails.setClickHandler(() => closeFilmDetails(filmDetails, siteBodyElement));
  siteBody.classList.add(`hide-overflow`);
  document.addEventListener(`keydown`, (evt) => {
    closeFilmDetailsEsc(evt, filmDetails, siteBody);
  });
};

const renderFilmsList = (count, films, siteBody) => {
  const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
  const firstFilm = films[0];
  for (let i = 0; i < count; i++) {
    const filmItem = films.pop();
    const card = new FilmCard(filmItem);
    render(siteFilmListElement, card, RenderPosition.BEFOREEND);
    card.setClickHandler(() => showFilmDetails(firstFilm, siteBody));
  }
};

const siteBodyElement = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, new HeaderProfile(), RenderPosition.BEFOREEND);
render(siteMainElement, new ListEmpty(filmsSorted.watchlist.length, filmsSorted.history.length, filmsSorted.favorites.length), RenderPosition.BEFOREEND);
render(siteMainElement, new SortMenu(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsContainer(), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;

if (allFilmsForView.length > 0) {
  renderFilmsList(FILM_COUNT_FOR_LIST, allFilmsForView, siteBodyElement);
  const showButtonComponent = new ButtonShowMore();
  render(siteMainElement, showButtonComponent, RenderPosition.BEFOREEND);
  showButtonComponent.setClickHandler(() => {
    let countCardsForRender = FILM_COUNT_FOR_LIST;
    if (FILM_COUNT_FOR_LIST > allFilmsForView.length) {
      countCardsForRender = allFilmsForView.length;
    }
    renderFilmsList(countCardsForRender, allFilmsForView, siteBodyElement);
    if (allFilmsForView.length === 0) {
      remove(showButtonComponent);
    }
  });
} else {
  const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
  render(siteFilmListElement, new NoMoviesBlock(), RenderPosition.BEFOREEND);
}

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms), RenderPosition.BEFOREEND);
