import SiteMenuView from './view/site-menu.js';
import ButtonNewView from './view/button-new.js';
import StatisticsView from './view/statistics.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {isOnline} from './utils/common.js';
import {toast} from './utils/toast.js';
import {UpdateType, MenuItem} from './utils/const.js';
import {RenderPosition, render, remove} from './utils/render.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic 7RUkyeQDQt5JBhJZOo26a';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');

const siteMenuComponent = new SiteMenuView();
siteMenuComponent.hideMenu();

const buttonNewComponent = new ButtonNewView();
render(tripMainElement, buttonNewComponent, RenderPosition.BEFOREEND);
buttonNewComponent.addDisabled();
buttonNewComponent.setButtonClickHandler(() => {
  tripPresenter.restoreDefaults();

  if (!isOnline()) {
    toast('You can\'t create new point offline');
    return;
  }

  tripPresenter.createPoint();
});

const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, buttonNewComponent, pointsModel, filterModel, destinationsModel, offersModel, apiWithProvider);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPresenter.init();
      filterPresenter.init();
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
      buttonNewComponent.addDisabled();
      break;
  }
};

Promise
  .all([
    api.getOffers(),
    api.getDestinations(),
    apiWithProvider.getPoints(),
  ])
  .then(([offers, destinations, points]) => {
    offersModel.setOffers(UpdateType.INIT, offers);
    destinationsModel.setDestinations(UpdateType.INIT, destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    siteMenuComponent.showMenu();
    buttonNewComponent.removeDisabled();
  })
  .catch(() => {
    offersModel.setOffers(UpdateType.INIT, []);
    destinationsModel.setDestinations(UpdateType.INIT, []);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

tripPresenter.init();
filterPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
