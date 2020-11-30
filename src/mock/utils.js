export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export const generateRating = () => {
  let integerNum = getRandomInteger(0, 10);
  let decimalNum = getRandomInteger(0, 10);
  return integerNum === 10 ? `${integerNum}.0` : `${integerNum}.${decimalNum}`;
};

export const generateReleaseDate = () => {
  return new Date(getRandomInteger(1930, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31));
};

export const generateMockData = (n, list) => {
  let data = [];
  for (let i = 0; i <= n; i++) {
    let index = getRandomInteger(0, list.length - 1);
    let item = list[index];
    data.push(item);
  }
  return data;
};

export const generateNameFilm = (list) => {
  let index = getRandomInteger(0, list.length - 1);
  let item = list.splice(index, 1)[0];
  return item;
};
