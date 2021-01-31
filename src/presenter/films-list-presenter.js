import {remove, render, RenderPosition, updateItem} from "../utils/render";
import {ButtonShowMore as ButtonShowMoreView} from "../view/button-show-more";
import {NoMoviesBlock as NoMoviesBlockView} from "../view/no-movies";
import {FilmCard as FilmCardView} from "../view/film-card";
import {FilmDetailsElement as FilmDetailsElementView} from "../view/film-details";
import {Comments as CommentsView} from "../view/film-comments";
import {
  closeFilmDetails,
  closeFilmDetailsEsc,
  emoji,
  SortType,
  filmsSort, profileRating,
} from "../utils/films";
import SortMenu from "../view/sort-menu";
import FilmsContainer from "../view/films-container";
import {nanoid} from 'nanoid';
import Comments from "../model/comments";
import ListEmpty from "../view/list-empty";
import Stats from "../view/stats";


const FILM_COUNT_FOR_LIST = 5;

export default class MovieList {
  constructor(container, filmsModel, filtersModel, api) {
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._container = container;
    this._currentSortButton = SortType.DEFAULT;
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
  }

  init() {
    this._renderFilter();
    this._stats = new Stats(this._filmsModel.getFilms().slice(), `ALL_TIME`, profileRating(this._filtersModel.getFilter().watched));
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
    const currentFilm = this._getFilms().slice()[index];
    this._filmDetails = new FilmDetailsElementView(currentFilm);
    render(document.body, this._filmDetails, RenderPosition.BEFOREEND);
    this._api.getComments(currentFilm.id).then((comments) => {
      this._commentsList[index].setComments(comments);
    }).then(() => {
      this._comments = new CommentsView(this._commentsList[index].getComments());
      render(this._filmDetails, this._comments, RenderPosition.BEFOREEND);
      this._setHendlersComment(this._comments, index);
    })
      .catch(() => {
        this._commentsList[index].setComments([]);
      });
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
    let updatedFilm = Object.assign({}, this._getFilms()[index], {[evt.target.name]: !this._getFilms()[index][evt.target.name]});
    this._api.updateFilm(updatedFilm).then((update) => {
      this._filmsModel.updateFilm(update);
      this._clearFilmList();
      this.init();
    });
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
    this.init();
  }

  _handleFilterClick(evt) {
    const typeFilter = evt.target.getAttribute(`data-filter`);
    if (this._typeFilter !== typeFilter) {
      this._typeFilter = typeFilter;
    }
    if (this._typeFilter === `stats`) {
      this._containerFilmsListComponent.hide();
      this._buttonShowMore.hide();
      this._sortMenu.hide();
      this._stats.show();
    } else {
      this._stats.hide();
      this._containerFilmsListComponent.show();
      this._sortMenu.show();
      this._buttonShowMore.show();
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
