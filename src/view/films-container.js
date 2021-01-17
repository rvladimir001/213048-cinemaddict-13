import Abstract from "./abstract";

const createFilmsContainer = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <div class="films-list__container"><div>
      </section class="films">
    </section class="films-list">`
  );
};

export default class FilmsContainer extends Abstract {
  getTemplate() {
    return createFilmsContainer();
  }
}
