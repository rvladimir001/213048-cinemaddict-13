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

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const timeFormatting = (time) => {
  let h = Math.trunc(time / 60);
  let m = time % 60;
  return `${h} h ${m} m`;
};

const UserStatus = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BAFF: `Movie Buff`
};

export const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserStatus.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserStatus.FAN;
  } else {
    return UserStatus.MOVIE_BAFF;
  }
};
