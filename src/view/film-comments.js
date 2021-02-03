import Smart from "./smart";
import {createElement, render} from "../utils";
import {RenderPosition} from "../utils/render";
import {createEmojiLabel} from "../utils/films";
import he from "he";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const createComments = (comments) => {
  const createCommentTemplate = (commentsList) => {
    let commentTemplate = ``;
    for (const comment of commentsList) {
      commentTemplate += `<li class="film-details__comment" id="${comment.id}">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-smile">
                </span>
                <div>
                  <p class="film-details__comment-text">${he.encode(comment.content)}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${comment.author}</span>
                    <span class="film-details__comment-day">${dayjs().to(dayjs(comment.commentDate))}</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>`;
    }
    return commentTemplate;
  };

  return `<section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">${createCommentTemplate(comments)}</ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>`;
};

export class Comments extends Smart {
  constructor(comments) {
    super();
    this._element = null;
    this._comments = comments;
    this._deleteClickComment = this._deleteClickComment.bind(this);
    this._addCommentEmotion = this._addCommentEmotion.bind(this);
  }

  getTemplate() {
    return createComments(this._comments);
  }

  getDeleteLinks() {
    return this.getElement().querySelectorAll(`.film-details__comment-delete`);
  }

  getInputsEmoji() {
    return this.getElement().querySelectorAll(`.film-details__emoji-item`);
  }

  _deleteClickComment(evt) {
    evt.preventDefault();
    this._callback.removeClick(evt);
  }

  setDeleteCommentHandler(callback) {
    this._callback.removeClick = callback;
    for (const link of this.getDeleteLinks()) {
      link.addEventListener(`click`, this._deleteClickComment);
    }
  }

  _addCommentEmotion(evt) {
    evt.preventDefault();
    this._callback.addClickEmotion(evt);
  }

  renderEmoji(nameEmoji, emoji) {
    const img = createElement(createEmojiLabel(emoji));
    nameEmoji.innerHTML = ``;
    render(nameEmoji, img, RenderPosition.BEFOREEND);
  }

  setAddCommentHandler(callback) {
    this._callback.addClickEmotion = callback;
    for (const i of this.getInputsEmoji()) {
      i.addEventListener(`change`, this._addCommentEmotion);
    }
  }

  setDisabledForm() {
    return this.getElement().querySelector(`.film-details__comment-input`).setAttribute(`disabled`, `disabled`);
  }

  removeDisabledForm() {
    return this.getElement().querySelector(`.film-details__comment-input`).removeAttribute(`disabled`, `disabled`);
  }

  getCommentValue() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }

  getEmojiValue() {
    return this.getElement().querySelectorAll(`.film-details__emoji-item`);
  }

  getCommentId(evt) {
    return evt.target.closest(`.film-details__comment`).getAttribute(`id`);
  }

  setTextButton(evt, value) {
    evt.target.textContent = value;
  }

  setDisabledButton(evt, status) {
    if (status) {
      evt.target.setAttribute(`disabled`, `disabled`);
    } else {
      evt.target.removeAttribute(`disabled`);
    }
  }

  removeShake(evt) {
    const submitForm = evt.target.closest(`.film-details__comment`);
    if (submitForm.classList.contains(`shake`)) {
      submitForm.classList.remove(`shake`);
    }
  }

  addShake(evt) {
    const submitForm = evt.target.closest(`.film-details__comment`);
    submitForm.classList.add(`shake`);
  }
}
