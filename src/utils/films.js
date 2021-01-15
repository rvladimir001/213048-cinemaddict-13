import {remove} from "./render";

export const filmsSort = (allFilmsForView) => {
  return {
    watchlist: allFilmsForView.filter((item) => item.watchlist),
    watched: allFilmsForView.filter((item) => item.watched),
    favorites: allFilmsForView.filter((item) => item.favorite),
  };
};

export const closeFilmDetails = (filmDetails) => {
  filmDetails.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, () => closeFilmDetails);
  remove(filmDetails);
  document.body.classList.remove(`hide-overflow`);
};

export const closeFilmDetailsEsc = (evt, filmDetails, siteBody) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closeFilmDetails(filmDetails, siteBody);
    document.removeEventListener(`keydown`, () => closeFilmDetailsEsc(evt, filmDetails, siteBody));
  }
};
