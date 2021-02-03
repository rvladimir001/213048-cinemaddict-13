import HeaderProfile from "./view/header-profile.js";
import FooterStat from "./view/footer-stat.js";
import {render, RenderPosition} from "./utils/render.js";
import MovieList from "./presenter/films-list-presenter.js";
import Films from "./model/movies";
import FiltersModel from "./model/filters";
import Api from "./api.js";
import {profileRating} from "./utils/films";

const AUTHORIZATION = `Basic eo0w590ik29889aqw`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStat = siteFooterElement.querySelector(`.footer__statistics`);

const filmsModel = new Films();
const filtersModel = new FiltersModel();


const filmsPresenter = new MovieList(siteMainElement, filmsModel, filtersModel, api);
api.getFilms().then((films) => {
  filmsModel.setFilms(films);
  const watchedCount = filtersModel.getWatched(filmsModel.getFilms().slice()).length;
  render(siteHeaderElement, new HeaderProfile(profileRating(watchedCount)), RenderPosition.BEFOREEND);
  render(siteFooterStat, new FooterStat(films.length), RenderPosition.BEFOREEND);
}).catch(() => {
  filmsModel.setFilms([]);
}).finally(() => filmsPresenter.init());
