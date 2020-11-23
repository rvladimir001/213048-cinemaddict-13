import {createFilmCard} from "./film-card.js"
export const createElementFilm = (FILM_COUNT)=> {
    let films = ``
    for (let i = 1; i <= FILM_COUNT; i++) {
        films += createFilmCard();
    };

return `
    <section class="films">
        <section class="films-list">
            <div class="films-list__container">
                ${films}
            <div>
        <section class="films">
    <section class="films-list">
  `};