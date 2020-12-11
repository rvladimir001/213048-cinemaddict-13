import {nanoid} from 'nanoid';
import {
  generateRating,
  generateReleaseDate,
  generateReleaseDateDetails,
  getRandomElementsFromArray,
  getRandomOneElementFromArray,
  getRandomBoolean,
  generatedDescription,
} from "./utils.js";
import {generateComments} from './comment.js';

const FILM_COUNT = 15;

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum
pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget,
sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam,
eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.
Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const films = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `Made for Each Other`,
  `The Great Flamarion`,
  `Green Mile`,
  `Lord of the Rings`,
  `Interstellar`,
  `Forrest Gump`,
  `Man in Black`,
  `Prometheus`,
  `Alien`,
  `Aliens`,
  `Crow`,
];

const posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`,
];

const directors = [
  `Anthony Mann`,
  `Steven Spilber`,
  `Robert Zemeckis`,
  `Ridley Scott`,
  `Quentin Tarantino`,
  `Peter Jackson`,
  `Martin Scorsese`,
];

const genres = [
  `Drama`,
  `Travell`,
  `Adventure`,
  `Comedy`,
  `History`,
];

const writers = [
  `Quentin Tarantino`,
  `Joel & Ethan Coen`,
  `Woody Allen`,
  `Oliver Stone`,
  `Aaron Sorkin`,
  `Jorj Lucas`,
  `Bo Goldman`,
  `Eric Roth`,
  `Robert Benton`,
];

const actors = [
  `Michael J. Fox`,
  `Christopher Lloyd`,
  `Liam Neeson`,
  `Orlando Blum`,
  `Bred Pit`,
  `Kristian Bail`,
  `Leonardo Dicaproi`,
  `Kira Naitly`,
  `Nataly Portman`,
  `Ribert Deniro`,
  `John Dep`,
  `Tom Krus`,
  `Tom Henks`,
  `Edward Norton`,
  `Joaquin Phoenix`,
];

const country = [
  `USA`,
  `Germany`,
  `Russia`,
  `France`,
  `England`,
  `Italy`,
];

const runtime = [
  `1h 50m`,
  `1h 43m`,
  `2h 06m`,
  `1h 32m`,
  `2h 43m`,
  `1h 27m`,
  `2h 12m`,
  `1h 54m`,
  `1h 45m`,
  `1h 32m`,
];

const category = [
  `6+`,
  `10+`,
  `12+`,
  `16+`,
  `18+`,
];

const generateFilm = () => {
  return {
    id: nanoid(),
    name: getRandomOneElementFromArray(films),
    poster: getRandomOneElementFromArray(posters),
    rating: generateRating(),
    director: getRandomOneElementFromArray(directors),
    writers: getRandomElementsFromArray(writers),
    actors: getRandomElementsFromArray(actors),
    releaseDate: generateReleaseDate(),
    releaseFullDate: generateReleaseDateDetails(),
    runtime: getRandomOneElementFromArray(runtime),
    country: getRandomElementsFromArray(country),
    genres: getRandomElementsFromArray(genres),
    description: generatedDescription(TEXT),
    favorite: getRandomBoolean(),
    watchlist: getRandomBoolean(),
    history: getRandomBoolean(),
    watched: getRandomBoolean(),
    comments: generateComments(),
    category: getRandomOneElementFromArray(category),
  };
};

export const allFilmsForView = new Array(FILM_COUNT).fill().map(generateFilm);
