import Abstract from "./abstract";

const createNoMoviesBlock = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export class NoMoviesBlock extends Abstract {
  getTemplate() {
    return createNoMoviesBlock();
  }
}
