import {createListEmptyTemplate} from "./view/list-empty.js"
import {createHeaderProfileTemplate} from "./view/header-profile.js"
import {createSortTemplate} from "./view/sort-menu.js"
import {createFilmCard} from "./view/film-card.js"
import {CreateButtonShowMore} from "./view/button-show-more.js"
import {createFooterStat} from "./view/footer-stat.js"
import {createFilmDetailsElement} from "./view/film-details.js"

const FILM_COUNT_FOR_LIST = 5;

const render = (container, template, place)=> {
    container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

const siteHeaderProfile = siteHeaderElement.querySelector(`.header__profile`);
render(siteHeaderProfile, createHeaderProfileTemplate(), `beforeend`);

render(siteMainElement, createListEmptyTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);

const siteFilmListElement = siteMainElement.querySelector(`.films-list__container`);
for (let i = 0; i < FILM_COUNT_FOR_LIST; i++) {
    render(siteFilmListElement, createFilmCard(), `beforeend`);
  }

render(siteMainElement, CreateButtonShowMore(), `beforeend`);

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStat, createFooterStat(), `beforeend`);

render(siteBodyElement, createFilmDetailsElement(), `beforeend`);