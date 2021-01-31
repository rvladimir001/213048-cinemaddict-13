import Observer from "../utils/observer";
import {month} from "../utils/films";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
    this._notify(this._films, null);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(update) {
    const index = this._films.findIndex((movie) => movie.id === update.id);
    if (index === -1) {
      throw new Error(`Не возможно обновить фильм`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(update);
  }

  static adapterToClient(film) {
    const filmDate = new Date(film.film_info.release.date);
    const releaseDate = filmDate.getFullYear();
    const releaseFullDate = `${filmDate.getDay() + 1} ${month[filmDate.getMonth()]} ${filmDate.getFullYear()}`;
    const adaptedFilm = Object.assign({}, film, {
      actors: film.film_info.actors,
      category: film.film_info.age_rating,
      name: film.film_info.title,
      originTitle: film.film_info.alternative_title,
      poster: film.film_info.poster,
      description: film.film_info.description,
      director: film.film_info.director,
      genres: film.film_info.genre,
      releaseDate,
      releaseFullDate,
      country: film.film_info.release.release_country,
      runtime: film.film_info.runtime,
      rating: film.film_info.total_rating,
      writers: film.film_info.writers,
      watchlist: film.user_details.watchlist,
      watched: film.user_details.already_watched,
      favorite: film.user_details.favorite,
      watchedDate: film.user_details.watching_date,
    });

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    return adaptedFilm;
  }

  static adapterToServer(film) {
    const adaptedFilm = Object.assign({}, film, {
      "film_info": {
        "actors": film.actors,
        "age_rating": film.category,
        "alternative_title": film.originTitle,
        "description": film.description,
        "director": film.director,
        "genre": film.genres,
        "poster": film.poster,
        "release": {
          "date": new Date(film.releaseFullDate),
          "release_country": film.country,
        },
        "runtime": film.runtime,
        "title": film.name,
        "total_rating": film.rating,
        "writers": film.writers,
      },
      "user_details": {
        "watchlist": film.watchlist,
        "already_watched": film.watched,
        "favorite": film.favorite,
        "watching_date": film.watchedDate,
      },
    });

    delete adaptedFilm.runtime;
    delete adaptedFilm.releaseFullDate;
    delete adaptedFilm.originTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.category;
    delete adaptedFilm.name;
    delete adaptedFilm.actors;
    delete adaptedFilm.age;
    delete adaptedFilm.info;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genres;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.time;
    delete adaptedFilm.rating;
    delete adaptedFilm.writers;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.watched;
    delete adaptedFilm.favorite;
    delete adaptedFilm.watchedDate;

    return adaptedFilm;
  }
}
