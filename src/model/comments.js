import Observer from "../utils/observer.js";

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

  }
}
