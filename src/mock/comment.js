import {nanoid} from 'nanoid';
import {getRandomOneElementFromArray, getRandomInteger, generateCommentDate} from "./utils";

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

const generateComment = function () {
  return {
    id: nanoid(),
    author: getRandomOneElementFromArray(authors),
    emoji: getRandomOneElementFromArray(emojiList),
    commentDate: generateCommentDate(),
    content: getRandomOneElementFromArray(comments),
  };
};

export const generateComments = function () {
  return new Array(getRandomInteger(0, 5)).fill().map(generateComment);
};
