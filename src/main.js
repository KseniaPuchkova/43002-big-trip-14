import SiteMenuView from './view/site-menu.js';
import TripInfoView  from './view/trip-info.js';
import FiltersView  from './view/filters.js';
import SortingView  from './view/sorting.js';
import PointsListView  from './view/points-list.js';
import EditPointView  from './view/edit-point.js';
import PointView  from './view/point.js';
import TotalPriceView  from './view/total-price.js';
import NoPointsView  from './view/no-points.js';
import {generatePoints} from './mocks/point.js';
import {generateFilters} from './mocks/filters.js';
import {SORT_TYPES} from './utils/const.js';
import {RenderPosition, render, getTotalPrice} from './utils/utils.js';

const POINTS_COUNT = 3;
const points = generatePoints(POINTS_COUNT);
const filters = generateFilters();
const totalPrice = getTotalPrice(points);

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');


const renderPoint = (point) => {
  const pointViewElement = new PointView(point).getElement();
  const editPointViewElement = new EditPointView(point).getElement();

  const replacePointToEdit = () => {
    pointsListElement.replaceChild(editPointViewElement, pointViewElement);
  };

  const replaceEditToPoint = () => {
    pointsListElement.replaceChild(pointViewElement, editPointViewElement);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointViewElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  });

  editPointViewElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEditToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  editPointViewElement.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const pointsListElement = tripEventsElement.querySelector('.trip-events__list');
  render(pointsListElement, pointViewElement, RenderPosition.BEFOREEND);
};

if (!points.length) {
  render(tripEventsElement, new NoPointsView().getElement(), RenderPosition.AFTERBEGIN);

} else {
  render(tripMainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);

  const tripInfoElement = tripMainElement.querySelector('.trip-info');
  render(tripInfoElement, new TotalPriceView(totalPrice).getElement(), RenderPosition.BEFOREEND);

  render(tripControlsNavigationElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
  render(tripControlsFiltersElement, new FiltersView(filters).getElement(), RenderPosition.BEFOREEND);

  render(tripEventsElement, new SortingView(SORT_TYPES).getElement(), RenderPosition.BEFOREEND);
  render(tripEventsElement, new PointsListView().getElement(), RenderPosition.BEFOREEND);

  points.forEach((point) => (renderPoint(point)));
}
