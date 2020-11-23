import {createFilmCard} from "./film-card.js"
export const createElementMostComment = (FILM_COUNT)=> {
    let films = ``
    for (let i = 1; i <= FILM_COUNT; i++) {
        films += createFilmCard();
    };
    return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">Most commented</h2>
            <div class="films-list__container">${films}</div>
            </section>`
}    
