import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {createNewPointTemplate} from './view/new-point.js';
import {createTotalPriceTemplate} from './view/total-price.js';

const POINTS_COUNT = 3;

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripControlFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

function render (container, template, place) {
  container.insertAdjacentHTML(place, template);
}

render (tripMainElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = document.querySelector('.trip-info');
render (tripInfoElement, createTotalPriceTemplate(), 'beforeend');

render (tripControlsElement, createSiteMenuTemplate(), 'beforeend');
render (tripControlFiltersElement, createFiltersTemplate(), 'afterbegin');
render (tripEventsElement, createSortingTemplate(), 'afterbegin');
render (tripEventsElement, createPointsListTemplate(), 'beforeend');

const tripsListElement = document.querySelector('.trip-events__list');
render (tripsListElement, createEditPointTemplate(), 'beforeend');
render (tripsListElement, createNewPointTemplate(), 'beforeend');

for (let i = 0; i < POINTS_COUNT; i++) {
  render(tripsListElement, createPointTemplate(), 'beforeend');
}
