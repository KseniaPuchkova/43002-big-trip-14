import SiteMenuView from './view/site-menu.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {TRANSFERS, ACTIVITIES} from './utils/const.js';
import {generatePoints, generateDestinationsMap, generateOffersMap} from './mocks/point.js';
import {RenderPosition, render} from './utils/render.js';

const POINTS_COUNT = 20;
const points = generatePoints(POINTS_COUNT);
const destinations = generateDestinationsMap();
const offers = generateOffersMap([...TRANSFERS, ...ACTIVITIES]);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

pointsModel.setPoints(points);
destinationsModel.setDestinations(destinations);
offersModel.setOffers(offers);

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointButtonAddElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const siteMenuComponent = new SiteMenuView();
render(tripControlsNavigationElement, siteMenuComponent , RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, tripPointButtonAddElement, pointsModel, filterModel, destinationsModel, offersModel);
filterPresenter.init();
tripPresenter.init();

tripPointButtonAddElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
