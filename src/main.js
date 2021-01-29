import HeaderProfile from "./view/header-profile.js";
import FooterStat from "./view/footer-stat.js";
import {render, RenderPosition} from "./utils/render.js";
import MovieList from "./presenter/films-list-presenter.js";
import {allFilmsForView} from "./mock/film";
import Films from "./model/movies";
import FiltersModel from "./model/filters";


const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

const filmsModel = new Films();
filmsModel.setFilms(allFilmsForView);

render(siteHeaderElement, new HeaderProfile(), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;
const filtersModel = new FiltersModel();
const filmsPresentor = new MovieList(siteMainElement, filmsModel, filtersModel);
const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms), RenderPosition.BEFOREEND);

filmsPresentor.init();
