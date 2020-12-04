import ListEmpty from "./view/list-empty.js";
import HeaderProfile from "./view/header-profile.js";
import SortMenu from "./view/sort-menu.js";
import FilmsContainer from "./view/films-container.js";
import FilmCard from "./view/film-card.js";
import ButtonShowMore from "./view/button-show-more.js";
import FooterStat from "./view/footer-stat.js";
import FilmDetailsElement from "./view/film-details.js";
import Comments from "./view/film-comments.js";
import {render, RenderPosition} from "./utils.js";
import {allFilmsForView} from "./mock/film";

const FILM_COUNT_FOR_LIST = 5;

const filmsSort = () => {
  return {
    watchlist: allFilmsForView.filter((item) => item.watchlistStatus),
    history: allFilmsForView.filter((item) => item.historyStatus),
    favorites: allFilmsForView.filter((item) => item.favoritesStatus),
  };
};
const filmsSorted = filmsSort();

const closeFilmDetails = (filmDetails, siteBody)=> {
  filmDetails.getElement().remove();
  filmDetails.removeElement();
  siteBody.classList.remove(`hide-overflow`);
};

const showFilmDetails = (film, siteBody)=> {
  const filmDetails = new FilmDetailsElement(film);
  render(siteBodyElement, filmDetails.getElement(), RenderPosition.BEFOREEND);
  const siteFilmComments = siteBodyElement.querySelector(`.film-details__bottom-container`);
  render(siteFilmComments, new Comments(film.comments).getElement(), RenderPosition.BEFOREEND);
  filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => closeFilmDetails(filmDetails, siteBodyElement));
  siteBody.classList.add(`hide-overflow`);
};

const renderFilmsList = (count, films, siteBody) => {
  const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
  for (let i = 0; i < count; i++) {
    const filmItem = films.pop();
    const card = new FilmCard(filmItem);
    render(siteFilmListElement, card.getElement(), RenderPosition.BEFOREEND);
    card.getElement().addEventListener(`click`, () => showFilmDetails(firstFilm, siteBody));
  }
};

const siteBodyElement = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, new HeaderProfile().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new ListEmpty(filmsSorted.watchlist.length, filmsSorted.history.length, filmsSorted.favorites.length).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortMenu().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsContainer().getElement(), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;
const firstFilm = allFilmsForView.slice(-1)[0];
renderFilmsList(FILM_COUNT_FOR_LIST, allFilmsForView, siteBodyElement);

if (allFilmsForView.length > 0) {
  render(siteMainElement, new ButtonShowMore().getElement(), RenderPosition.BEFOREEND);
  const showButton = siteMainElement.querySelector(`.films-list__show-more`);
  showButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    let countCardsForRender = FILM_COUNT_FOR_LIST;
    if (FILM_COUNT_FOR_LIST > allFilmsForView.length) {
      countCardsForRender = allFilmsForView.length;
    }
    renderFilmsList(countCardsForRender, allFilmsForView, siteBodyElement);
    if (allFilmsForView.length === 0) {
      showButton.remove();
    }
  });
}

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms).getElement(), RenderPosition.BEFOREEND);
