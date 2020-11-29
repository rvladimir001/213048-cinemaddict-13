import {createListEmptyTemplate} from "./view/list-empty.js";
import {createHeaderProfileTemplate} from "./view/header-profile.js";
import {createSortTemplate} from "./view/sort-menu.js";
import {createFilmCard} from "./view/film-card.js";
import {createButtonShowMore} from "./view/button-show-more.js";
import {createFooterStat} from "./view/footer-stat.js";
import {createFilmDetailsElement} from "./view/film-details.js";
import {generateFilm, generateComment} from "./mock/film";
import {createComments} from "./view/film-comments.js";

const FILM_COUNT = 15;
const COMMENTS_COUNT = 5;
const ALL_FILMS = new Array(FILM_COUNT).fill().map(generateFilm);
const allFilmsForView = ALL_FILMS.slice();
let filmCountForList = 5;

const filmsSort = () => {
  return {
    watchlist: ALL_FILMS.filter((item) => item.watchlistStatus),
    history: ALL_FILMS.filter((item) => item.historyStatus),
    favorites: ALL_FILMS.filter((item) => item.favoritesStatus),
  };
};
const filmsSorted = filmsSort();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmsList = (count, films, createElementMethod) => {
  let siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
  for (let i = 0; i < count; i++) {
    let filmItem = films.pop();
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


const allComments = new Array(COMMENTS_COUNT).fill().map(generateComment);
const totalFilms = allFilmsForView.length;
const firstFilm = allFilmsForView.slice(-1);
renderFilmsList(filmCountForList, allFilmsForView, createFilmCard);

if (allFilmsForView.length > 0) {
  render(siteMainElement, createButtonShowMore(), `beforeend`);
  const showButton = siteMainElement.querySelector(`.films-list__show-more`);
  showButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    if (filmCountForList > allFilmsForView.length) {
      filmCountForList = allFilmsForView.length;
    }
    renderFilmsList(filmCountForList, allFilmsForView, createFilmCard);
    if (allFilmsForView.length === 0) {
      showButton.remove();
    }
  });
}

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, createFooterStat(totalFilms), `beforeend`);
render(siteBodyElement, createFilmDetailsElement(firstFilm[0], allComments.length), `beforeend`);

const siteFilmsCards = siteBodyElement.querySelectorAll(`.film-card`);
siteFilmsCards.forEach((card) => {
  card.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    render(siteBodyElement, createFilmDetailsElement(firstFilm[0], allComments.length), `beforeend`);
    closeFilmsDetailsListener();
  });
});

closeFilmsDetailsListener();

const siteFilmComments = siteBodyElement.querySelector(`.film-details__comments-list`);

for (const comment of allComments) {
  render(siteFilmComments, createComments(comment), `beforeend`);
}
