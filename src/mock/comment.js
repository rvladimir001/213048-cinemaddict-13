import {nanoid} from 'nanoid';
import {getRandomOneElementFromArray, getRandomInteger} from "./utils";

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

const generateComment = function () {
  return {
    id: nanoid(),
    author: getRandomOneElementFromArray(authors),
    emoji: getRandomOneElementFromArray(emojiList),
    commentDate: getRandomOneElementFromArray(dates),
    content: getRandomOneElementFromArray(comments),
  };
};

export const generateComments = function () {
  return new Array(getRandomInteger(0, 5)).fill().map(generateComment);
};
