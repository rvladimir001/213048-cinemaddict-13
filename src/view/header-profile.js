import Abstract from "./abstract";

const createHeaderProfileTemplate = (userStatus) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${userStatus}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class HeaderProfile extends Abstract {
  constructor(userStatus) {
    super();
    this._userStatus = userStatus;

  }

  getTemplate() {
    return createHeaderProfileTemplate(this._userStatus);
  }
}
