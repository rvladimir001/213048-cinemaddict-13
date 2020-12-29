import ListEmpty from "./view/list-empty.js";
import HeaderProfile from "./view/header-profile.js";
import SortMenu from "./view/sort-menu.js";
import FilmsContainer from "./view/films-container.js";
import FooterStat from "./view/footer-stat.js";
import {render, RenderPosition} from "./utils/render.js";
import {filmsSort} from "./utils/films.js";
import MovieList from "./presenter/films-list-presenter.js";
import {allFilmsForView} from "./mock/film";

const filmsSorted = filmsSort(allFilmsForView);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, new HeaderProfile(), RenderPosition.BEFOREEND);
render(siteMainElement, new ListEmpty(filmsSorted.watchlist.length, filmsSorted.watched.length, filmsSorted.favorites.length), RenderPosition.BEFOREEND);
render(siteMainElement, new SortMenu(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsContainer(), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;
const filmsPresentor = new MovieList(siteMainElement, allFilmsForView);
const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms), RenderPosition.BEFOREEND);

filmsPresentor.init();
