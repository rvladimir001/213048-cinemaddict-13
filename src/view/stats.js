import Smart from "./smart";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";

const Period = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getStatsDataForPeriod = {
  [Period.ALL_TIME]: (films) => films,
  [Period.TODAY]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedDate).isAfter(now.subtract(1, `day`))),
  [Period.WEEK]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedDate).isAfter(now.subtract(1, `week`))),
  [Period.MONTH]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedDate).isAfter(now.subtract(1, `month`))),
  [Period.YEAR]: (films, now = dayjs()) => films.filter((film) => dayjs(film.watchedDate).isAfter(now.subtract(1, `year`))),
};

const getGenresStats = (films) => {
  const genresStats = {};
  films.reduce((acc, film) => acc.concat(film.genres), [])
    .forEach((genre) => {
      if (genresStats[genre]) {
        genresStats[genre]++;
        return;
      }
      genresStats[genre] = 1;
    });

  return genresStats;
};

const getTopGenres = (films) => {
  if (films.length === 0) {
    return false;
  }
  const genresStats = getGenresStats(films);
  return Object.entries(genresStats).sort((a, b) => b[1] - a[1])[0][0];
};

const getTotal = (films) => {
  let j = 0;
  for (let i = 0; i < films.length; i++) {
    j = j + films[i].runtime;
  }
  const hours = (j >= 60) ? Math.floor(j / 60) : 0;
  const minutes = j % 60;
  return {hours, minutes};
};

const renderChart = (statisticCtx, films) => {
  if (films.length === 0) {
    return false;
  }

  const labels = [];
  const counts = [];

  Object
    .entries(getGenresStats(films))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => {
      labels.push(label);
      counts.push(count);
    });

  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * Object.values(labels).length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatTemplate = (localData) => {
  const {films, currentPeriod, user} = localData;
  const filmsWatchedAmount = films.length;
  const {hours, minutes} = getTotal(films);
  const topGenre = getTopGenres(films);
  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${user}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${Period.ALL_TIME === currentPeriod ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${Period.TODAY === currentPeriod ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${Period.WEEK === currentPeriod ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${Period.MONTH === currentPeriod ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${Period.YEAR === currentPeriod ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsWatchedAmount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>
  `);
};

export default class Stats extends Smart {
  constructor(films, currentPeriod, user) {
    super();
    this._films = films;
    this._currentPeriod = currentPeriod;
    this._user = user;
    this._chart = null;
    this._data = {films: this._films, currentPeriod: this._currentPeriod, user: this._user};
    this._setChart();
    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setInnerHandler();
  }

  getTemplate() {
    return createStatTemplate(this._data);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();
    const newPeriod = evt.target.value;
    if (this._currentPeriod === newPeriod) {
      return;
    }
    this._currentPeriod = newPeriod;
    const filteredFilms = getStatsDataForPeriod[this._currentPeriod](this._films);
    this._updateStatsData({films: filteredFilms, currentPeriod: this._currentPeriod, user: this._user});
  }

  _updateStatsData(date) {
    this._data = Object.assign({}, this._film, date);
    this.updateElement();
  }

  _setInnerHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandler();
    this._setChart();
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const statistic = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(statistic, this._data.films);
  }
}
