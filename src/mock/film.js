import {nanoid} from 'nanoid';
import {
  getRandomInteger,
  generateRating,
  generateReleaseDate,
  generateReleaseDateDetails,
  getRandomElementsFromArray,
  getRandomOneElementsFromArray,
  getRandomBoolean,
  generatedArrDescription,
} from "./utils.js";

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

export const generateFilm = () => {
  return {
    id: nanoid(),
    name: getRandomOneElementsFromArray(films),
    poster: getRandomOneElementsFromArray(posters),
    rating: generateRating(),
    director: getRandomOneElementsFromArray(directors),
    writers: getRandomElementsFromArray(writers),
    actors: getRandomElementsFromArray(actors),
    releaseDate: generateReleaseDate(),
    releaseFullDate: generateReleaseDateDetails(),
    runtime: getRandomOneElementsFromArray(runtime),
    country: getRandomElementsFromArray(country),
    genres: getRandomElementsFromArray(genres),
    description: getRandomElementsFromArray(generatedArrDescription(TEXT)),
    favoritesStatus: getRandomBoolean(),
    watchlistStatus: getRandomBoolean(),
    historyStatus: getRandomBoolean(),
    alreadyWatchedSatus: getRandomBoolean(),
    commentQuantity: getRandomInteger(0, 5),
    category: getRandomOneElementsFromArray(category),
  };
};

const authors = [
  `John Doe`,
  `Tim Macoveev`,
  `John Snow`,
  `Ned Stark`,
];

const emojiList = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`,
];

const comments = [
  `Interesting setting and a good cast`,
  `Very very old. Meh`,
  `Booooooooooring`,
  `Almost two hours? Seriously?`,
];

const dates = [
  `2 days ago`,
  `3 days ago`,
  `5 days ago`,
  `Today `,
  `2019/12/31 23:59`,
  `2019/12/29 15:13`,
  `2019/11/25 23:59`,
];

export const generateComment = function () {
  return {
    id: nanoid(),
    author: getRandomOneElementsFromArray(authors),
    emoji: getRandomOneElementsFromArray(emojiList),
    commentDate: getRandomOneElementsFromArray(dates),
    content: getRandomOneElementsFromArray(comments),
  };
};
