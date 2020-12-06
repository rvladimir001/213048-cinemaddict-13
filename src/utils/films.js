import {remove} from "./render";

export const filmsSort = (allFilmsForView) => {
  return {
    watchlist: allFilmsForView.filter((item) => item.watchlistStatus),
    history: allFilmsForView.filter((item) => item.historyStatus),
    favorites: allFilmsForView.filter((item) => item.favoritesStatus),
  };
};

export const closeFilmDetails = (filmDetails, siteBody) => {
  filmDetails.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, () => closeFilmDetails);
  remove(filmDetails);
  siteBody.classList.remove(`hide-overflow`);
};

export const closeFilmDetailsEsc = (evt, filmDetails, siteBody) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closeFilmDetails(filmDetails, siteBody);
    document.removeEventListener(`keydown`, () => closeFilmDetailsEsc(evt, filmDetails, siteBody));
  }
};
