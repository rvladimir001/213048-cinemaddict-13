import ListEmpty from "./view/list-empty.js";
import HeaderProfile from "./view/header-profile.js";
import FooterStat from "./view/footer-stat.js";
import {render, RenderPosition} from "./utils/render.js";
import {filmsSort} from "./utils/films.js";
import MovieList from "./presenter/films-list-presenter.js";
import {allFilmsForView} from "./mock/film";
import Films from "./model/movies";
import Comments from "./model/comments";

const filmsSorted = filmsSort(allFilmsForView);
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

const filmsModel = new Films();
filmsModel.setFilms(allFilmsForView);

const commentsModel = new Comments();

render(siteHeaderElement, new HeaderProfile(), RenderPosition.BEFOREEND);
render(siteMainElement, new ListEmpty(filmsSorted.watchlist.length, filmsSorted.watched.length, filmsSorted.favorites.length), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;
const filmsPresentor = new MovieList(siteMainElement, filmsModel, commentsModel);
const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms), RenderPosition.BEFOREEND);

filmsPresentor.init();
