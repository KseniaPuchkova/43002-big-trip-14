import SiteMenuView from './view/site-menu.js';
import TripInfoView  from './view/trip-info.js';
import FiltersView  from './view/filters.js';
import TotalPriceView  from './view/total-price.js';
import TripPresenter from './presenter/trip.js';
import {generatePoints} from './mocks/point.js';
import {generateFilters} from './mocks/filters.js';
import {getTotalPrice} from './utils/common.js';
import {RenderPosition, render} from './utils/render.js';

const POINTS_COUNT = 5;
const points = generatePoints(POINTS_COUNT);
const filters = generateFilters();
const totalPrice = getTotalPrice(points);

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, new TotalPriceView(totalPrice), RenderPosition.BEFOREEND);

render(tripControlsNavigationElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
render(tripControlsFiltersElement, new FiltersView(filters), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripEventsElement);
tripPresenter.init(points);
