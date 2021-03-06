import {remove} from "./render";

export const filmsSort = (allFilmsForView) => {
  return {
    watchlist: allFilmsForView.filter((item) => item.watchlist),
    watched: allFilmsForView.filter((item) => item.watched),
    favorites: allFilmsForView.filter((item) => item.favorite),
  };
};

export const closeFilmDetails = (filmDetails) => {
  remove(filmDetails);
  document.body.classList.remove(`hide-overflow`);
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

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const timeFormatting = (time) => {
  const hours = Math.trunc(time / 60);
  const minutes = time % 60;
  return `${hours} h ${minutes} m`;
};

const UserStatus = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`,
};

export const profileRating = (count) => {
  if (count > 1 && count <= 10) {
    return UserStatus.NOVICE;
  } else if (count > 10 && count <= 20) {
    return UserStatus.FAN;
  } else {
    return UserStatus.MOVIE_BUFF;
  }
};

export const month = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];
