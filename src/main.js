import {createListEmptyTemplate} from "./view/list-empty.js";
import {createHeaderProfileTemplate} from "./view/header-profile.js";
import {createSortTemplate} from "./view/sort-menu.js";
import {createFilmCard} from "./view/film-card.js";
import {createButtonShowMore} from "./view/button-show-more.js";
import {createFooterStat} from "./view/footer-stat.js";
import {createFilmDetailsElement} from "./view/film-details.js";
import {generateFilm, generateComment} from "./mock/film";
import {createComments} from "./view/film-comments.js";

let filmCountForList = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`body`);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);
const siteHeaderProfile = siteHeaderElement.querySelector(`.header__profile`);

render(siteHeaderProfile, createHeaderProfileTemplate(), `beforeend`);
render(siteMainElement, createListEmptyTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);

const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);

let allFilms = [];
for (let i = 0; i <= 15; i++) {
  allFilms.push(generateFilm());
}

let allComments = [];
for (let i = 0; i <= 4; i++) {
  allComments.push(generateComment());
}

const totalFilms = allFilms.length;
const firstFilm = allFilms.slice(-1);
for (let i = 0; i < filmCountForList; i++) {
  let filmItem = allFilms.pop();
  render(siteFilmListElement, createFilmCard(filmItem), `beforeend`);
}

if (allFilms.length > 0) {
  render(siteMainElement, createButtonShowMore(), `beforeend`);
  const showButton = siteMainElement.querySelector(`.films-list__show-more`);
  showButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    if (filmCountForList > allFilms.length) {
      filmCountForList = allFilms.length;
    }
    for (let i = 0; i < filmCountForList; i++) {
      let filmItem = allFilms.pop();
      render(siteFilmListElement, createFilmCard(filmItem), `beforeend`);
    }
    if (allFilms.length === 0) {
      showButton.remove();
    }
  });
}

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, createFooterStat(totalFilms), `beforeend`);
render(siteBodyElement, createFilmDetailsElement(firstFilm[0], allComments.length), `beforeend`);

const siteFilmComments = siteBodyElement.querySelector(`.film-details__comments-list`);


for (const comment of allComments) {
  render(siteFilmComments, createComments(comment), `beforeend`);
}
