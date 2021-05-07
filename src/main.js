import SiteMenuView from './view/site-menu.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {generatePoints} from './mocks/point.js';
import {RenderPosition, render} from './utils/render.js';

const POINTS_COUNT = 5;
const points = generatePoints(POINTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripEventsElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointAddButtonElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const siteMenuComponent = new SiteMenuView();
render(tripControlsNavigationElement, siteMenuComponent , RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, tripPointAddButtonElement, filterModel, pointsModel);
tripPresenter.init();

tripPointAddButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
  tripPointAddButtonElement.disabled = true;
});
