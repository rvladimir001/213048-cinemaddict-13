import HeaderProfile from "./view/header-profile.js";
import FooterStat from "./view/footer-stat.js";
import {render, RenderPosition} from "./utils/render.js";
import MovieList from "./presenter/films-list-presenter.js";
import {allFilmsForView} from "./mock/film";
import Films from "./model/movies";
import FiltersModel from "./model/filters";
import Api from "./api.js";

const AUTHORIZATION = `Basic eo0w590ik29889aqw`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, new HeaderProfile(), RenderPosition.BEFOREEND);

const totalFilms = allFilmsForView.length;
const filtersModel = new FiltersModel();
const filmsModel = new Films();


const filmsPresentor = new MovieList(siteMainElement, filmsModel, filtersModel);
api.getFilms().then((films) => {
  filmsModel.setFilms(films);
}).catch(() => {
  filmsModel.setFilms([]);
}).finally(()=> filmsPresentor.init());

const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

render(siteFooterStat, new FooterStat(totalFilms), RenderPosition.BEFOREEND);


