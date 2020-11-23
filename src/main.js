import {createListEmptyTemplate} from "./view/list-empty.js"
import {createHeaderProfileTemplate} from "./view/header-profile.js"
import {createSortTemplate} from "./view/sort-menu.js"
import {createElementFilm} from "./view/film-element-list.js"
import {CreateButtonShowMore} from "./view/button-show-more.js"
import {createElementTopRated} from "./view/top-rated.js"
import {createElementMostComment} from "./view/most-comment.js"
import {createFooterStat} from "./view/footer-stat.js"
import {createFilmDetailsElement} from "./view/film-details.js"

const FILM_COUNT_FOR_LIST = 5;
const FILM_COUNT_FOR_TOP = 2;
const FILM_COUNT_FOR_MOST_COMMENT = 2;

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
render(siteMainElement, createElementFilm(FILM_COUNT_FOR_LIST), `beforeend`);
render(siteMainElement, CreateButtonShowMore(), `beforeend`);

const siteFilmsListElement = siteMainElement.querySelector(`.films`);
render(siteFilmsListElement, createElementTopRated(FILM_COUNT_FOR_TOP), `beforeend`);
render(siteFilmsListElement, createElementMostComment(FILM_COUNT_FOR_MOST_COMMENT), `beforeend`);

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);
render(siteFooterStat, createFooterStat(), `beforeend`);

render(siteBodyElement, createFilmDetailsElement(), `beforeend`);