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
  if (evt.key === `Escape` || evt.code === `Escape`) {
    evt.preventDefault();
    closeFilmDetails(filmDetails, siteBody);
  }
};

export const emoji = (emotion) => {
  switch (emotion) {
    case `angry`:
      return `angry.png`;
    case `puke`:
      return `puke.png`;
    case `sleeping`:
      return `sleeping.png`;
    case `smile`:
      return `smile.png`;
  }
  return null;
};

export const createEmojiLabel = (emotion) => {
  return `<img src="./images/emoji/${emoji(emotion)}" width="55" height="55" alt="emoji-${emotion}">`;
};
