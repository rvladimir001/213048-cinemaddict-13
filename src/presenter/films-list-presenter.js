import {remove, render, RenderPosition, updateItem} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetailsElement as FilmDetailsElementView} from "../view/film-details";
import {Comments as CommentsView} from "../view/film-comments";
import {closeFilmDetails, closeFilmDetailsEsc, emoji, UserAction, UpdateType, SortType} from "../utils/films";
import SortMenu from "../view/sort-menu";
import FilmsContainer from "../view/films-container";
import {nanoid} from 'nanoid';
import Comments from "../model/comments";


const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, filmsModel, commentsModel) {
    this._filmsModel = filmsModel;
    // this._commentsModel = commentsModel;
    this._container = container;
    this._currentSortButton = SortType.DEFAULT;
    this._renderFilmsCount = FILM_COUNT_FOR_LIST;
    this._containerFilmsListComponent = new FilmsContainer();
    this._containerFilms = null;
    this._sortMenu = new SortMenu();
    this._buttonShowMore = new ButtonShowMoreView();
    this._nomovies = new NoMoviesBlockView();
    this._filmDetailsStatus = true;
    this._filmDetails = null;
    this._typeSort = `default`;
    this._allFilmsForView = null;
    this._countCardInPage = 5;
    this.currentFilmInde = null;
    this._commentsList = [];
    // this._handleViewAction = this._handleViewAction.bind(this);
    // this._handleModelEvent = this._handleModelEvent.bind(this);
    //
    // this._filmsModel.addObserver(this._handleModelEvent);
    //
    // this._handleDeleteClick = this._handleDeleteClick.bind(this);
    // this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);
    // this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
    // this._handleAddComment = this._handleAddComment.bind(this);
  }

  init() {
    this._renderSort();
    render(this._container, this._containerFilmsListComponent, RenderPosition.BEFOREEND);
    this._containerFilms = this._container.querySelector(`.films-list__container`);
    this._countFilmsForView = 0;
    this._renderFilmsBlock();
  }

  _getFilms() {
    switch (this._typeSort) {
      case `rating`:
        return this._filmsModel.getFilms().slice().sort((a, b) => a.rating > b.rating ? 1 : -1);
      case `date`:
        return this._filmsModel.getFilms().slice().sort((a, b) => a.releaseDate > b.releaseDate ? 1 : -1);
    }
    return this._filmsModel.getFilms();
  }

  _renderFilmsList(start, end) {
    for (let i = start; i < end; i++) {
      this._cardFilmComponent = new FilmCardView(this._getFilms().slice()[i]);
      let commentsModel = new Comments();
      commentsModel.setComments(this._getFilms().slice()[i].comments);
      this._commentsList.push(commentsModel);
      render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
      this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(i));
      this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, i));
    }
  }

  _renderFilmsBlock() {
    const filmsCount = this._getFilms().slice().length;
    if (filmsCount > 0) {
      let countCardsForRender = null;
      this._renderFilmsList(0, this._countCardInPage);
      if (filmsCount > this._countCardInPage) {
        this._renderShowButton();
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
    this.currentFilmInde = index;
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
    this._filmDetails = new FilmDetailsElementView(this._getFilms().slice()[index]);
    this._comments = new CommentsView(this._commentsList[index].getComments());
    render(document.body, this._filmDetails, RenderPosition.BEFOREEND);
    render(this._filmDetails, this._comments, RenderPosition.BEFOREEND);
    this._setHendlersComment(this._comments, index);
    this._handleFormSubmit(index);
    this._filmDetails.setClickHandler(() => this._close());
    document.addEventListener(`keydown`, (evt) => {
      this._closeEsc(evt, this._filmDetails);
    });

    this._filmDetails.setClickHandlerEditStatus((evt) => {
      this._editFilm(evt, index);
    });
  }

  _setHendlersComment(comment, index) {
    comment.setDeleteCommentHandler((evt) => this._removeFilmComment(evt, index));
    // comment.setDeleteClickHandler(this._handleDeleteClick);
    comment.setAddCommentHandler((evt) => this._addFilmComment(evt));
  }

  _editFilm(evt, index) {
    let updatedFilm = updateItem(this._getFilms(), Object.assign({}, this._getFilms()[index], {[evt.target.name]: !this._getFilms()[index][evt.target.name]}));
    this._filmsModel.setFilms(updatedFilm);
    this._clearFilmList();
    this.init();
  }

  _close() {
    closeFilmDetails(this._filmDetails, this._containerFilms);
    remove(this._filmDetails);
    remove(this._comments);
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
    this.init();
  }

  _removeFilmComment(evt, index) {
    let commentId = evt.target.closest(`.film-details__comment`).getAttribute(`id`);
    this._commentsList[index].deleteComment(commentId);
    this._updateComment(index);
  }

  _addFilmComment(evt) {
    const labelEmotion = this._comments.getElement().querySelector(`.film-details__add-emoji-label`);
    const emotion = evt.target.value;
    this._comments.renderEmoji(labelEmotion, emotion);
  }

  _handleFormSubmit(index) {
    document.addEventListener(`keydown`, (evt) => {
      if ((evt.ctrlKey) && (evt.code === `Enter`)) {
        evt.preventDefault();
        this.submitComments(index);
      }
    });
  }

  _updateComment(index) {
    remove(this._comments);
    this._comments = new CommentsView(this._commentsList[index].getComments());
    render(this._filmDetails, this._comments, RenderPosition.BEFOREEND);
    this._setHendlersComment(this._comments, index);
  }

  submitComments(index) {
    let text = this._comments.getElement().querySelector(`.film-details__comment-input`);
    const emotions = document.querySelectorAll(`.film-details__emoji-item`);
    let currentEmoji;
    for (let emotion of emotions) {
      if (emotion.checked) {
        currentEmoji = emotion.value;
      }
    }
    if (currentEmoji !== null && text) {
      let newComment = {
        id: nanoid(),
        content: text.value,
        author: `I'm`,
        emoji: emoji(currentEmoji),
        commentDate: new Date(),
      };
      this._commentsList[index].addComment(newComment);
    }
    this._updateComment(index);
  }
}
