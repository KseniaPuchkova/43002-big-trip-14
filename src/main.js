import SiteMenuView from './view/site-menu.js';
import ButtonNewView from './view/button-new.js';
import StatisticsView from './view/statistics.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {AUTHORIZATION, END_POINT, POINTS_STORE_NAME, OFFERS_STORE_NAME, DESTINATIONS_STORE_NAME, RenderPosition, UpdateType, MenuItem} from './utils/const.js';
import {isOnline} from './utils/common.js';
import {render, remove} from './utils/render.js';
import {toastMessage} from './utils/message.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);


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

  if (!isOnline()) {
    toastMessage('You can\'t create new point offline');
    return;
  }

  tripPresenter.restoreDefaults();
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
      statisticsComponent = new StatisticsView(pointsModel.get());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      buttonNewComponent.addDisabled();
      break;
  }
};

Promise
  .all([
    apiWithProvider.getOffers(),
    apiWithProvider.getDestinations(),
    apiWithProvider.getPoints(),
  ])
  .then(([offers, destinations,  points]) => {
    offersModel.set(UpdateType.INIT, offers);
    destinationsModel.set(UpdateType.INIT, destinations);
    pointsModel.set(UpdateType.INIT, points);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    siteMenuComponent.showMenu();
    buttonNewComponent.removeDisabled();
  })
  .catch(() => {
    offersModel.set(UpdateType.INIT, []);
    destinationsModel.set(UpdateType.INIT, []);
    pointsModel.set(UpdateType.INIT, []);
    render(tripControlsNavigationElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    toastMessage('Something went wrong. Please, reload the page');
  });

tripPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
  if (!isOnline()) {
    document.title += ' [offline]';
    toastMessage('Offline mode');
  }
});

window.addEventListener('online', () => {
  toastMessage('The connection restored. Online mode');
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toastMessage('The connection lost. Offline mode');
  document.title += ' [offline]';
});
