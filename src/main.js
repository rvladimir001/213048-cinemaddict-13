import {createListEmptyTemplate} from "./view/list-empty.js";
import {createHeaderProfileTemplate} from "./view/header-profile.js";
import {createSortTemplate} from "./view/sort-menu.js";
import {createFilmCard} from "./view/film-card.js";
import {createButtonShowMore} from "./view/button-show-more.js";
import {createFooterStat} from "./view/footer-stat.js";
import {createFilmDetailsElement} from "./view/film-details.js";
import {createComments} from "./view/film-comments.js";
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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsList = (count, films, createElementMethod) => {
  const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
  for (let i = 0; i < count; i++) {
    const filmItem = films.pop();
    render(siteFilmListElement, createElementMethod(filmItem), `beforeend`);
  }
};

const closeFilmsDetailsListener = () => {
  const closeButtonFilmDetails = siteBodyElement.querySelector(`.film-details__close-btn`);
  closeButtonFilmDetails.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const siteFilmDetails = siteBodyElement.querySelector(`.film-details`);
    siteFilmDetails.remove();
  });
};

const siteBodyElement = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);
const siteHeaderProfile = siteHeaderElement.querySelector(`.header__profile`);

render(siteHeaderProfile, createHeaderProfileTemplate(), `beforeend`);
render(siteMainElement, createListEmptyTemplate(filmsSorted.watchlist.length, filmsSorted.history.length, filmsSorted.favorites.length), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);

const totalFilms = allFilmsForView.length;
const firstFilm = allFilmsForView.slice(-1);
renderFilmsList(FILM_COUNT_FOR_LIST, allFilmsForView, createFilmCard);

if (allFilmsForView.length > 0) {
  render(siteMainElement, createButtonShowMore(), `beforeend`);
  const showButton = siteMainElement.querySelector(`.films-list__show-more`);
  showButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    let countCardsForRender = FILM_COUNT_FOR_LIST;
    if (FILM_COUNT_FOR_LIST > allFilmsForView.length) {
      countCardsForRender = allFilmsForView.length;
    }
    renderFilmsList(countCardsForRender, allFilmsForView, createFilmCard);
    if (allFilmsForView.length === 0) {
      showButton.remove();
    }
  });
}

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, createFooterStat(totalFilms), `beforeend`);
render(siteBodyElement, createFilmDetailsElement(firstFilm[0]), `beforeend`);

const siteFilmsCards = siteBodyElement.querySelectorAll(`.film-card`);
siteFilmsCards.forEach((card) => {
  card.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    render(siteBodyElement, createFilmDetailsElement(firstFilm[0]), `beforeend`);
    const siteFilmComments = siteBodyElement.querySelector(`.film-details__bottom-container`);
    render(siteFilmComments, createComments(allFilmsForView[0].comments), `beforeend`);
    closeFilmsDetailsListener();
  });
});

closeFilmsDetailsListener();

const siteFilmComments = siteBodyElement.querySelector(`.film-details__bottom-container`);
render(siteFilmComments, createComments(allFilmsForView[0].comments), `beforeend`);
