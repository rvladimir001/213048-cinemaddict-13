export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export const generateRating = () => {
  let integerNum = getRandomInteger(1, 10);
  let decimalNum = getRandomInteger(0, 10);
  return integerNum === 10 ? `${integerNum}.0` : `${integerNum}.${decimalNum}`;
};

export const generateReleaseDate = () => {
  return new Date(getRandomInteger(1930, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));
};

export const generateReleaseDateDetails = () => {
  let randomDate = generateReleaseDate();
  let months = [
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
  return `${randomDate.getDate()} ${months[randomDate.getMonth()]} ${randomDate.getFullYear()}`;
};

export const getRandomElementsFromArray = (list) => {
  let data = [];
  let temporaryList = list.slice();
  let n = getRandomInteger(1, temporaryList.length - 1);
  for (let i = 0; i <= n; i++) {
    let index = getRandomInteger(0, temporaryList.length - 1);
    let item = temporaryList.splice(index, 1);
    data.push(item);
  }
  return data;
};

export const getRandomOneElementsFromArray = (list) => {
  let index = getRandomInteger(0, list.length - 1);
  return list[index];
};

export const getRandomBoolean = () => {
  return Boolean(Math.round(Math.random()));
};

export const generatedArrDescription = (text) => {
  return text.split(`.`);
};
