export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export const generateRating = () => {
  const integerNum = getRandomInteger(10, 100);
  return integerNum / 10;
};

export const generateReleaseDate = () => {
  return new Date(getRandomInteger(1930, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));
};

const months = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

export const generateReleaseDateDetails = () => {
  const randomDate = generateReleaseDate();
  return `${randomDate.getDate()} ${months[randomDate.getMonth()]} ${randomDate.getFullYear()}`;
};

export const getRandomElementsFromArray = (list) => {
  const data = [];
  const temporaryList = list.slice();
  const n = getRandomInteger(1, temporaryList.length - 1);
  for (let i = 0; i <= n; i++) {
    const index = getRandomInteger(0, temporaryList.length - 1);
    const item = temporaryList.splice(index, 1)[0];
    data.push(item);
  }
  return data;
};

export const getRandomOneElementFromArray = (list) => {
  const index = getRandomInteger(0, list.length - 1);
  return list[index];
};

export const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

export const generatedDescription = (text) => {
  const listSentence = getRandomElementsFromArray(text.split(`.`));
  return listSentence.join(`. `) + `.`;
};
