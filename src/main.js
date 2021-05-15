import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {UpdateType, MenuItem, FilterType} from './utils/const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 7RUkyeQDQt5JBhJZOo22a';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripPointButtonAddElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const siteMenuComponent = new SiteMenuView();
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, tripPointButtonAddElement, pointsModel, filterModel, destinationsModel, offersModel, api);
filterPresenter.init();
tripPresenter.init();

tripPointButtonAddElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint();
});

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPointButtonAddElement.disabled = false;
      break;
    case MenuItem.STATS:
      tripPresenter.restoreDefaults();
      tripPresenter.hideTripline();
      tripPresenter.destroy();
      filterPresenter.init(true);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      tripPointButtonAddElement.disabled = true;
      break;
  }
};

Promise
  .all([
    api.getPoints(),
    api.getDestinations(),
    api.getOffers(),
  ])
  .then((value) => {
    offersModel.setOffers(UpdateType.INIT, value[2]);
    destinationsModel.setDestinations(UpdateType.INIT, value[1]);
    pointsModel.setPoints(UpdateType.INIT, value[0]);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    offersModel.setOffers(UpdateType.INIT, []);
    destinationsModel.setDestinations(UpdateType.INIT, []);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
