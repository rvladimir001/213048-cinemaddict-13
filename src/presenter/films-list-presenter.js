import {remove, render, RenderPosition} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetailsElement as FilmDetailsElementView} from "../view/film-details";
import {Comments as CommentsView} from "../view/film-comments";
import {
  closeFilmDetails,
  closeFilmDetailsEsc,
  filmsSort, profileRating,
} from "../utils/films";
import SortMenu from "../view/sort-menu";
import FilmsContainer from "../view/films-container";
import Comments from "../model/comments";
import ListEmpty from "../view/list-empty";
import Stats from "../view/stats";
import dayjs from "dayjs";


const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, filmsModel, filtersModel, api) {
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._container = container;
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._containerFilmsListComponent = new FilmsContainer();
    this._containerFilms = null;
    this._sortMenu = new SortMenu();
    this._filterMenu = new ListEmpty();
    this._buttonShowMore = new ButtonShowMoreView();
    this._nomovies = new NoMoviesBlockView();
    this._stats = null;
    this._filmDetailsStatus = true;
    this._filmDetails = null;
    this._typeSort = `default`;
    this._typeFilter = `all`;
    this._countCardInPage = 5;
    this._commentsList = [];
    this._api = api;
    this._updateCommentStatus = false;
    this._sendCommentStatus = true;
    this._comments = null;
    this._indexCurentFilm = null;
  }

  init() {
    this._renderFilter();
    const watchedCount = this._filtersModel.getWatched(this._filmsModel.getFilms().slice()).length;
    this._stats = new Stats(this._filmsModel.getFilms().slice(), `ALL_TIME`, profileRating(watchedCount));
    render(this._container, this._stats, RenderPosition.BEFOREEND);
    this._stats.hide();
    this._renderSort();
    render(this._container, this._containerFilmsListComponent, RenderPosition.BEFOREEND);
    this._containerFilms = this._container.querySelector(`.films-list__container`);
    this._countFilmsForView = 0;
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
      this._api.getComments(actualFilm.id).then((comments) => {
        this._createCardFilmComponent(actualFilm, filmIndex, comments.length);
      }).catch(() => {
        this._createCardFilmComponent(actualFilm, filmIndex);
      });
    }
  }

  _createCardFilmComponent(actualFilm, filmIndex, commentsCount = 0) {
    this._cardFilmComponent = new FilmCardView(actualFilm, commentsCount);
    render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
    this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(filmIndex));
    this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, filmIndex));
  }

  _renderFilmsBlock() {
    this._countCardInPage = 5;
    const filmsCount = this._getFilms().slice().length;
    if (filmsCount > 0) {
      let countCardsForRender = null;
      if (filmsCount > this._countCardInPage) {
        this._renderFilmsList(0, this._countCardInPage);
        this._renderShowButton();
      } else {
        remove(this._buttonShowMore);
        this._renderFilmsList(0, filmsCount);
      }
      this._buttonShowMore.setClickHandler(() => {
        countCardsForRender = this._renderFilmsCount;
        this._countFilmsForView = this._countFilmsForView + countCardsForRender;
        if (filmsCount - (this._countFilmsForView) < this._renderFilmsCount) {
          countCardsForRender = filmsCount - this._countFilmsForView;
        }
        this._renderFilmsList(this._countFilmsForView, this._countFilmsForView + countCardsForRender);
        this._countCardInPage += countCardsForRender;
        if (filmsCount === this._countCardInPage) {
          remove(this._buttonShowMore);
        }
      });
    } else {
      this._renderNoMoviesBlock();
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
    if (this._countCardInPage !== 0) {
      this._renderFilmsCount = this._countCardInPage;
    }
    if (this._filmDetailsStatus) {
      this._filmDetailsStatus = false;
      this._renderFilmDetails(index);
    } else {
      this._filmDetailsStatus = false;
      remove(this._filmDetails);
      this._renderFilmDetails(index);
    }
  }

  _renderFilmDetails(index) {
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
    document.addEventListener(`keydown`, (evt) => {
      this.addEventSubmit(evt, index);
    });
    this._filmDetails.setClickHandler(() => this._close());
    document.addEventListener(`keydown`, (evt) => {
      this._closeEsc(evt);
    });
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
      this.init();
    });
  }

  _close() {
    closeFilmDetails(this._filmDetails, this._containerFilms);
    this._filmDetailsStatus = true;
  }

  _closeEsc(evt) {
    closeFilmDetailsEsc(evt, this._filmDetails);
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
    }
    this._clearFilmList();
    remove(this._stats);
    this.init();
  }

  _handleFilterClick(evt) {
    this._stats.hide();
    this._buttonShowMore.hide();
    const typeFilter = evt.target.getAttribute(`data-filter`);
    if (this._typeFilter !== typeFilter) {
      this._typeFilter = typeFilter;
      this._handleSortClick(evt);
      this._stats.hide();
      this._containerFilmsListComponent.show();
      this._sortMenu.show();
      this._buttonShowMore.show();
    }
    if (this._typeFilter === `stats`) {
      this._containerFilmsListComponent.hide();
      this._buttonShowMore.hide();
      this._sortMenu.hide();
      this._stats.show();
    }
  }

  _removeFilmComment(evt, index) {
    const deleteLink = evt.target;
    const commentElem = deleteLink.closest(`.film-details__comment`);
    const commentId = commentElem.getAttribute(`id`);
    deleteLink.setAttribute(`disabled`, `disabled`);
    deleteLink.textContent = `Deleting…`;
    if (commentElem.classList.contains(`shake`)) {
      commentElem.classList.remove(`shake`);
    }
    this._api.deleteComment(commentId).then((response) => {
      if (response.ok) {
        this._commentsList[index].deleteComment(commentId);
        this._sendCommentStatus = false;
        this._updateComment(this._commentsList[index].getComments(), index);
        this._sendCommentStatus = true;
      }
    }).catch(() => {
      deleteLink.removeAttribute(`disabled`);
      commentElem.classList.add(`shake`);
    }).finally(() => {
      deleteLink.textContent = `Delete`;
    });
  }

  _addFilmComment(evt) {
    const labelEmotion = this._comments.getElement().querySelector(`.film-details__add-emoji-label`);
    const emotion = evt.target.value;
    this._comments.renderEmoji(labelEmotion, emotion);
  }

  addEventSubmit(evt, index) {
    if ((evt.ctrlKey) && (evt.code === `Enter`)) {
      evt.preventDefault();
      this.submitComments(index);
    }
    document.removeEventListener(`keydown`, this.addEventSubmit);
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
    this.init();
  }

  submitComments(index) {
    const text = this._comments.getElement().querySelector(`.film-details__comment-input`);
    const emotions = document.querySelectorAll(`.film-details__emoji-item`);
    const submitForm = document.querySelector(`form.film-details__inner`);
    this._comments.setDisabledForm();
    if (submitForm.classList.contains(`shake`)) {
      submitForm.classList.remove(`shake`);
    }
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
          this._updateComment(data[1], index);
          this._commentsList[index].setComments(data[1]);
        }).catch(() => {
          submitForm.classList.add(`shake`);
        }).finally(() => {
          this._sendCommentStatus = true;
          this._comments.removeDisabledForm();
        });
      }
    }
  }
}
