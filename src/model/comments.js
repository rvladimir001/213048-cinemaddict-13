import Observer from "../utils/observer.js";
import {month} from "../utils/films";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      ...this._comments,
      update,
    ];
    this._notify();
  }

  deleteComment(updateId) {

    const index = this._comments.findIndex((comment) => comment.id === updateId);

    if (index === -1) {
      throw new Error(`Удалить комментарий не удалось!`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
    this._notify();
  }


  static adapterToClient(comment) {
    const commentDate = new Date(comment.date);
    const adaptedComment = Object.assign({}, comment, {
      emoji: comment.emotion,
      commentDate,
      content: comment.comment,
    });

    delete adaptedComment.comment;
    delete adaptedComment.emotion;
    delete adaptedComment.date;

    return adaptedComment;
  }


  static adaptToServer(comment) {
    const adaptedComment = Object.assign({}, comment, {
      comment: comment.content,
      emotion: comment.emoji,
      date: comment.commentDate,
    });
    delete adaptedComment.content;
    delete adaptedComment.commentDate;
    delete adaptedComment.emoji;

    return adaptedComment;
  }

  static adaptToClientAddCommented(update) {
    const updatedComment = [];
    update.comments.map((comment) => {
      const commentDate = new Date(comment.date);
      const adaptedComment = Object.assign({}, comment, {
        emoji: comment.emotion,
        commentDate,
        content: comment.comment,
      });

      delete adaptedComment.comment;
      delete adaptedComment.emotion;
      delete adaptedComment.date;

      updatedComment.push(adaptedComment);
    });

    const film = update.movie;
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

    return [adaptedFilm, updatedComment];
  }
}
