import SiteMenuView from './view/site-menu.js';
import TripInfoView  from './view/trip-info.js';
import FiltersView  from './view/filters.js';
import SortView  from './view/sort.js';
import PointsListView  from './view/points-list.js';
import EditPointView  from './view/edit-point.js';
import PointView  from './view/point.js';
import TotalPriceView  from './view/total-price.js';
import NoPointsView  from './view/no-points.js';
import {generatePoints} from './mocks/point.js';
import {generateFilters} from './mocks/filters.js';
import {SORT_TYPES} from './utils/const.js';
import {getTotalPrice} from './utils/common.js';
import {RenderPosition, render, replace} from './utils/render.js';

const POINTS_COUNT = 5;
const points = generatePoints(POINTS_COUNT);
const filters = generateFilters();
const totalPrice = getTotalPrice(points);

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const renderPoint = (point) => {
  const pointViewElement = new PointView(point);
  const editPointViewElement = new EditPointView(point);

  const replacePointToEdit = () => {
    replace(editPointViewElement, pointViewElement);
  };

  const replaceEditToPoint = () => {
    replace(pointViewElement, editPointViewElement);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === 'Escape' || evt.key === 'Esc';

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onPointButtonClick = () => {
    replacePointToEdit();
    document.addEventListener('keydown', onEscKeyDown);
  };

  const onEditPointButtonClick = () => {
    replaceEditToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEditPointSubmit = () => {
    replaceEditToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  };

  pointViewElement.setPointButtonClickHandler(onPointButtonClick);
  editPointViewElement.setEditPointButtonClickHandler(onEditPointButtonClick);
  editPointViewElement.setEditPointSubmitHandler(onEditPointSubmit);

  const pointsListElement = tripEventsElement.querySelector('.trip-events__list');
  render(pointsListElement, pointViewElement, RenderPosition.BEFOREEND);
};

if (!points.length) {
  render(tripEventsElement, new NoPointsView(), RenderPosition.AFTERBEGIN);

} else {
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);

  const tripInfoElement = tripMainElement.querySelector('.trip-info');
  render(tripInfoElement, new TotalPriceView(totalPrice), RenderPosition.BEFOREEND);

  render(tripControlsNavigationElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);
  render(tripControlsFiltersElement, new FiltersView(filters), RenderPosition.BEFOREEND);

  render(tripEventsElement, new SortView(SORT_TYPES), RenderPosition.BEFOREEND);
  render(tripEventsElement, new PointsListView(), RenderPosition.BEFOREEND);

  points.forEach((point) => (renderPoint(point)));
}
