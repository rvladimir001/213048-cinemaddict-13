import {remove, render, RenderPosition, updateItem} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetailsElement as FilmDetailsElementView} from "../view/film-details";
import {Comments as CommentsView} from "../view/film-comments";
import {closeFilmDetails, closeFilmDetailsEsc, emoji} from "../utils/films";
import SortMenu from "../view/sort-menu";
import FilmsContainer from "../view/films-container";
import {nanoid} from 'nanoid';


const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, filmsModel) {
    this._filmsModel = filmsModel;
    this._container = container;
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
  }

  init() {
    this._allFilmsForView = this._getFilms().slice();
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

    return this._filmsModel.getFilms()
  }

  _renderFilmsList(start, end) {
    for (let i = start; i < end; i++) {
      this._cardFilmComponent = new FilmCardView(this._allFilmsForView[i]);
      render(this._containerFilms, this._cardFilmComponent, RenderPosition.BEFOREEND);
      this._cardFilmComponent.setClickHandler(() => this._showFilmDetails(i));
      this._cardFilmComponent.setClickHandlerEditStatus((evt) => this._editFilm(evt, i));
    }
  }

  _renderFilmsBlock() {
    const filmsCount = this._allFilmsForView.length;
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
    this._filmDetails = new FilmDetailsElementView(this._allFilmsForView[index]);
    this._comments = new CommentsView(this._allFilmsForView[index].comments);
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
    comment.setAddCommentHandler((evt) => this._addFilmComment(evt));
  }

  _editFilm(evt, index) {
    updateItem(this._getFilms(), Object.assign({}, this._allFilmsForView[index], {[evt.target.name]: !this._allFilmsForView[index][evt.target.name]}));
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
    let commentInd = this._comments._comments.findIndex((item) => item.id === commentId);
    this._comments._comments.splice(commentInd, 1);
    this._updateComment(Object.assign({}, this._comments, {comments: this._comments.comments}), index);
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

  _updateComment(updatedFilm, index) {
    updateItem(this._getFilms(), updatedFilm);
    remove(this._comments);
    this._comments = new CommentsView(this._getFilms()[index].comments);
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
      this._comments._comments.push(newComment);
    }
    this._updateComment(Object.assign({}, this._allFilmsForView[index]._comments, this._allFilmsForView[index].comments), index);
  }
}
