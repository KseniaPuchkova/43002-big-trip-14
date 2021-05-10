import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import {generatePoints, generateDestinationsMap, generateOffersMap} from './mocks/point.js';
import {TRANSFERS, ACTIVITIES} from './mocks/point.js';
import {UpdateType, MenuItem, FilterType} from './utils/const.js';
import {showContainerline, hideContainerline} from './utils/point.js';
import {RenderPosition, render, remove} from './utils/render.js';

const POINTS_COUNT = 1;
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
let statisticsComponent = new StatisticsView(pointsModel.getPoints(), offersModel.getOffersTypes());
render(tripControlsNavigationElement, siteMenuComponent , RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, tripPointButtonAddElement, pointsModel, filterModel, destinationsModel, offersModel);
filterPresenter.init();
tripPresenter.init();

tripPointButtonAddElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      filterPresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      tripPointButtonAddElement.disabled = false;
      showContainerline();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      filterPresenter.init(true);
      tripPointButtonAddElement.disabled = true;
      hideContainerline();
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

