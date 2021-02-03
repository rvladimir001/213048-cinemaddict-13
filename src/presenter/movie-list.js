import {remove, render, RenderPosition} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies-block";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetails as FilmDetailsElementView} from "../view/film-details";
import {filmComments as CommentsView} from "../view/film-comments";
import {
  closeFilmDetails,
  filmsSort, profileRating,
} from "../utils/films";
import SortMenu from "../view/sort-menu";
import FilmsContainer from "../view/films-container";
import Comments from "../model/comments";
import FilterMenu from "../view/filter-menu";
import Stats from "../view/stats";
import dayjs from "dayjs";


const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, filmsModel, filtersModel, api, headerProfile) {
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._container = container;
    this._originFilmCounForList = FILM_COUNT_FOR_LIST;
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._containerFilmsListComponent = new FilmsContainer();
    this._containerFilms = null;
    this._sortMenu = new SortMenu();
    this._filterMenu = new FilterMenu();
    this._buttonShowMore = new ButtonShowMoreView();
    this._nomovies = new NoMoviesBlockView();
    this._headerProfile = headerProfile;
    this._stats = null;
    this._filmDetailsStatus = true;
    this._filmDetails = null;
    this._typeSort = `default`;
    this._typeFilter = `all`;
    this._countCardInPage = 5;
    this._commentsList = [];
    this._api = api;
    this._sendCommentStatus = true;
    this._comments = null;
    this._indexCurentFilm = null;
    this._countFilmsForView = 0;
    this.addEventSubmit = this.addEventSubmit.bind(this);
    this._closeEsc = this._closeEsc.bind(this);
  }

  init() {
    this._renderFilter();
    const watchedCount = this._filtersModel.getWatched(this._getFilms().slice()).length;
    this._stats = new Stats(this._getFilms().slice(), `ALL_TIME`, profileRating(watchedCount));
    render(this._container, this._stats, RenderPosition.BEFOREEND);
    this._stats.hide();
    this._headerProfile.setUserStatus(profileRating(watchedCount));
    this._headerProfile.updateUserStatus();
    this._renderSort();
    render(this._container, this._containerFilmsListComponent, RenderPosition.BEFOREEND);
    this._containerFilms = this._container.querySelector(`.films-list__container`);
    this._renderShowButton();
    this._renderFilmsBlock();
  }

  _getFilms() {
    this._filtersModel.setFilter(this._typeFilter);
    return this._filtersModel.sortFilms(this._filmsModel.getFilms(), this._typeSort);
  }

  _renderFilmsList(start, end) {
    for (let filmIndex = start; filmIndex < end; filmIndex++) {
      const commentsModel = new Comments();
      commentsModel.setComments(this._getFilms().slice()[filmIndex].comments);
      this._commentsList.push(commentsModel);
      const actualFilm = this._getFilms().slice()[filmIndex];
      this._createCardFilmComponent(actualFilm, filmIndex, this._getFilms().slice()[filmIndex].comments.length);
    }
  }

  _createCardFilmComponent(actualFilm, filmIndex, commentsCount = 0) {
    this._cardFilmComponent = new FilmCardView(actualFilm, commentsCount);
    render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
    this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(filmIndex));
    this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, filmIndex));
  }

  _renderFilmsBlock() {
    if (this._getFilms().slice().length > 0) {
      if (this._getFilms().slice().length > this._countCardInPage) {
        this._renderFilmsList(0, this._countCardInPage);
        this._buttonShowMore.show();
      } else {
        this._buttonShowMore.hide();
        this._renderFilmsList(0, this._getFilms().slice().length);
      }
    } else {
      this._buttonShowMore.hide();
      this._renderNoMoviesBlock();
    }
    this._buttonShowMore.setClickHandler(() => this._showMoreFilms());
  }

  _showMoreFilms() {
    this._countFilmsForView = this._countFilmsForView + this._renderFilmsCount;
    if (this._getFilms().slice().length - (this._countFilmsForView) < this._renderFilmsCount) {
      this._renderFilmsCount = this._getFilms().slice().length - this._countFilmsForView;
    }
    this._renderFilmsList(this._countFilmsForView, this._countFilmsForView + this._renderFilmsCount);
    this._countCardInPage += this._renderFilmsCount;
    if (this._getFilms().slice().length === this._countCardInPage) {
      this._buttonShowMore.hide();
    }
  }

  _renderNoMoviesBlock() {
    render(this._containerFilms, this._nomovies, RenderPosition.BEFOREEND);
  }

  _renderShowButton() {
    render(this._container, this._buttonShowMore, RenderPosition.BEFOREEND);
  }

  _showFilmDetails(index) {
    this._indexCurentFilm = index;
    if (this._filmDetailsStatus) {
      this._renderFilmDetails(index);
    } else {
      remove(this._filmDetails);
      this._renderFilmDetails(index);
    }
  }

  _renderFilmDetails(index) {
    this._filmDetailsStatus = false;
    this._comments = null;
    const currentFilm = this._getFilms().slice()[index];
    this._filmDetails = new FilmDetailsElementView(currentFilm);
    render(document.body, this._filmDetails, RenderPosition.BEFOREEND);
    this._api.getComments(currentFilm.id).then((comments) => {
      this._commentsList[index].setComments(comments);
    }).then(() => {
      this._comments = new CommentsView(this._commentsList[index].getComments());
      const commentsContainer = this._filmDetails.getElement().querySelector(`.film-details__bottom-container`);
      render(commentsContainer, this._comments, RenderPosition.BEFOREEND);
      this._setHendlersComment(this._comments, index);
    })
      .catch(() => {
        this._commentsList[index].setComments([]);
      });
    this._filmDetails.getElement().addEventListener(`keydown`, this.addEventSubmit);
    this._filmDetails.setClickHandler(() => this._close());
    document.addEventListener(`keydown`, this._closeEsc);
    this._filmDetails.setClickHandlerEditStatus((evt) => {
      this._editFilm(evt, index);
    });
  }

  _setHendlersComment(comment, index) {
    comment.setDeleteCommentHandler((evt) => this._removeFilmComment(evt, index));
    comment.setAddCommentHandler((evt) => this._addFilmComment(evt));
  }

  _editFilm(evt, index) {
    const updatedFilm = Object.assign({}, this._getFilms()[index], {[evt.target.name]: !this._getFilms()[index][evt.target.name]});
    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
      this._clearFilmList();
      this._renderFilmsBlock();
      if (!this._filmDetailsStatus) {
        this._showFilmDetails(index);
      }
      const filmsSorted = filmsSort(this._filmsModel.getFilms());
      this._filterMenu.setCounts(filmsSorted.watchlist.length, filmsSorted.watched.length, filmsSorted.favorites.length);
      this._filterMenu.updateCountMenu();
    });
  }

  _close() {
    closeFilmDetails(this._filmDetails, this._containerFilms);
    this._filmDetailsStatus = true;
    this._filmDetails.getElement().removeEventListener(`keydown`, this.addEventSubmit);
  }

  _closeEsc(evt) {
    if (evt.key === `Escape` || evt.code === `Escape`) {
      evt.preventDefault();
      closeFilmDetails(this._filmDetails);
      this._filmDetails.getElement().removeEventListener(`keydown`, this.addEventSubmit);
      document.removeEventListener(`keydown`, this._closeEsc);
    }
    this._filmDetailsStatus = true;
  }

  _clearFilmList() {
    while (this._containerFilms.firstChild) {
      this._containerFilms.removeChild(this._containerFilms.firstChild);
    }
  }

  _renderFilter() {
    const filmsSorted = filmsSort(this._getFilms());
    this._filterMenu.setCounts(filmsSorted.watchlist.length, filmsSorted.watched.length, filmsSorted.favorites.length);
    render(this._container, this._filterMenu, RenderPosition.BEFOREEND);
    this._filterMenu.setClickHandler((evt) => this._handleFilterClick(evt));
  }

  _renderSort() {
    render(this._container, this._sortMenu, RenderPosition.BEFOREEND);
    this._sortMenu.setClickHandler((evt) => this._handleSortClick(evt));
  }

  _handleSortClick(evt) {
    const typeSort = evt.target.getAttribute(`data-sort`);
    if (this._typeSort !== typeSort) {
      this._typeSort = typeSort;
      this._clearFilmList();
      this._stats.hide();
      this._renderFilmsBlock();
    }
  }

  _handleFilterClick(evt) {
    this._countCardInPage = 5;
    this._countFilmsForView = 0;
    this._renderFilmsCount = this._originFilmCounForList;
    this._typeSort = `default`;
    this._sortMenu.setDefault();
    this._stats.hide();
    this._buttonShowMore.hide();
    const typeFilter = evt.target.getAttribute(`data-filter`);
    if (this._typeFilter !== typeFilter) {
      this._typeFilter = typeFilter;
      this._handleSortClick(evt);
      this._stats.hide();
      this._containerFilmsListComponent.show();
      this._sortMenu.show();
    }
    if (this._typeFilter === `stats`) {
      this._containerFilmsListComponent.hide();
      this._buttonShowMore.hide();
      this._sortMenu.hide();
      this._stats.show();
    }
  }

  _removeFilmComment(evt, index) {
    const commentId = this._comments.getCommentId(evt);
    this._comments.setDisabledButton(evt, true);
    this._comments.setTextButton(evt, `Deleting...`);
    this._comments.removeShake(evt);
    this._api.deleteComment(commentId).then((response) => {
      if (response.ok) {
        this._commentsList[index].deleteComment(commentId);
        this._sendCommentStatus = false;
        this._updateComment(this._commentsList[index].getComments(), index);
        this._sendCommentStatus = true;
      }
    }).catch(() => {
      this._comments.setDisabledButton(evt, false);
      this._comments.addShake(evt);
    }).finally(() => {
      this._comments.setTextButton(evt, `Delete`);
    });
  }

  _addFilmComment(evt) {
    const labelEmotion = this._comments.getElement().querySelector(`.film-details__add-emoji-label`);
    const emotion = evt.target.value;
    this._comments.renderEmoji(labelEmotion, emotion);
  }

  addEventSubmit(evt) {
    if ((evt.ctrlKey) && (evt.code === `Enter`)) {
      this.submitComments();
    }
  }

  _updateComment(comments, index) {
    remove(this._comments);
    this._comments = new CommentsView(comments);
    const updateCommentsContainer = this._filmDetails.getElement().querySelector(`.film-details__bottom-container`);
    render(updateCommentsContainer, this._comments, RenderPosition.BEFOREEND);
    if (this._sendCommentStatus) {
      this._comments.setDisabledForm();
    }
    this._setHendlersComment(this._comments, index);
    this._clearFilmList();
    const upFilm = Object.assign({}, this._getFilms()[index], {[`comments`]: comments});
    this._filmsModel.updateFilm(upFilm);
    this.init();
  }

  submitComments() {
    const text = this._comments.getCommentValue();
    const emotions = this._comments.getEmojiValue();
    this._filmDetails.removeShakeForm();
    let currentEmoji;
    for (const emotion of emotions) {
      if (emotion.checked) {
        currentEmoji = emotion.value;
      }
    }
    if (currentEmoji !== null && text) {
      const newComment = {
        content: text.value,
        author: `I'm`,
        emoji: currentEmoji,
        commentDate: dayjs().format(),
      };
      const film = this._getFilms()[this._indexCurentFilm];
      if (this._sendCommentStatus) {
        this._sendCommentStatus = false;
        this._api.addComment(newComment, film).then((data) => {
          this._updateComment(data[1], this._indexCurentFilm);
          this._commentsList[this._indexCurentFilm].setComments(data[1]);
        }).catch(() => {
          this._filmDetails.addShakeForm();
        }).finally(() => {
          this._sendCommentStatus = true;
          this._comments.removeDisabledForm();
        });
      }
    }
  }
}
