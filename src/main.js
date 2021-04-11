import {createSiteMenuTemplate} from './view/site-menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {createTotalPriceTemplate} from './view/total-price.js';
import {generatePoints} from './mocks/point.js';
import {generateFilters} from './mocks/filters.js';
import {generateSortingTypes} from './mocks/sorting.js';
import {getTotalPrice} from './utils/utils.js';

const POINTS_COUNT = 3;
const points = generatePoints(POINTS_COUNT);
const filters = generateFilters();
const typesOfsorting = generateSortingTypes();
const totalPrice = getTotalPrice(points);

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripControlFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

function render (container, template, place) {
  container.insertAdjacentHTML(place, template);
}

render (tripMainElement, createTripInfoTemplate(points), 'afterbegin');

const tripInfoElement = document.querySelector('.trip-info');
render (tripInfoElement, createTotalPriceTemplate(totalPrice), 'beforeend');

render (tripControlsElement, createSiteMenuTemplate(), 'beforeend');
render (tripControlFiltersElement, createFiltersTemplate(filters), 'afterbegin');
render (tripEventsElement, createSortingTemplate(typesOfsorting), 'afterbegin');
render (tripEventsElement, createPointsListTemplate(), 'beforeend');

const tripsListElement = tripEventsElement.querySelector('.trip-events__list');
render (tripsListElement, createEditPointTemplate(points[0]), 'beforeend');

for (let i = 0; i < POINTS_COUNT; i++) {
  render(tripsListElement, createPointTemplate(points[i]), 'beforeend');
}
