import SiteMenuView from './view/site-menu.js';
import ButtonNewView from './view/button-new.js';
import StatisticsView from './view/statistics.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {UpdateType, MenuItem} from './utils/const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 7RUkyeQDQt5JBhJZOo23a';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

Promise
  .all([
    api.getOffers(),
    api.getDestinations(),
    api.getPoints(),
  ])
  .then(([offers, destinations, points]) => {
    offersModel.setOffers(UpdateType.INIT, offers);
    destinationsModel.setDestinations(UpdateType.INIT, destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.init();
  })
  .catch(() => {
    offersModel.setOffers(UpdateType.INIT, []);
    destinationsModel.setDestinations(UpdateType.INIT, []);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const siteMenuComponent = new SiteMenuView();
const buttonNewComponent = new ButtonNewView();
render(tripMainElement, buttonNewComponent, RenderPosition.BEFOREEND);

buttonNewComponent.setButtonClickHandler(() => {
  tripPresenter.restoreDefaults();
  tripPresenter.createPoint();
});

const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, buttonNewComponent, pointsModel, filterModel, destinationsModel, offersModel, api);
tripPresenter.init();

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      buttonNewComponent.removeDisabled();
      break;
    case MenuItem.STATS:
      tripPresenter.restoreDefaults();
      tripPresenter.hideTripline();
      tripPresenter.destroy();
      filterPresenter.init(true);
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      buttonNewComponent.setDisabled();
      break;
  }
};
