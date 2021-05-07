import TripInfoView  from '../view/trip-info.js';
import TotalPriceView  from '../view/total-price.js';
import SortView  from '../view/sort.js';
import PointsListView  from '../view/points-list.js';
import NoPointsView  from '../view/no-points.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {getSortedItems, getTotalPrice} from '../utils/point.js';
import {SortType, FilterType, UpdateType, UserAction} from '../utils/const.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripMainElement, tripEventsElement, tripPointAddButtonElement, filterModel, pointsModel) {
    this._tripMainElement = tripMainElement;
    this._tripEventsElement = tripEventsElement;
    this._tripPointAddButtonElement = tripPointAddButtonElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._pointPresenters = {};

    this._currentSortType = SortType.DEFAULT;
    this._sortComponent = null;
    this._tripInfoComponent = null;
    this._totalPriceComponent = null;
    this._noPointsComponent = null;
    this._pointsListComponent = new PointsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._handleViewAction, tripPointAddButtonElement);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    this._sortedPoints = getSortedItems(filtredPoints, this._currentSortType);
    return filtredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _clearPointsPresenters() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _renderTripInfo() {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._sortedPoints);
    render(this._tripMainElement, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTotalPrice() {
    if (this._totalPriceComponent !== null) {
      remove(this._totalPriceComponent);
      this._totalPriceComponent = null;
    }

    const totalPrice = getTotalPrice(this._getPoints());
    this._totalPriceComponent = new TotalPriceView(totalPrice);
    render(this._tripInfoComponent, this._totalPriceComponent, RenderPosition.BEFOREEND);
  }

  _renderPointsList() {
    // if (this._pointsListComponent !== null) {
    //   remove(this._pointsListComponent );
    //   this._pointsListComponent  = null;
    // }

    // this._pointsListComponent = new PointsListView();
    render(this._tripEventsElement, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderNoPoints() {
    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
      this._noPointsComponent = null;
    }

    this._noPointsComponent = new NoPointsView();
    render(this._tripEventsElement, this._noPointsComponent, RenderPosition.AFTERBEGIN);
    remove(this._renderTripInfo());
    remove(this._renderTotalPrice());
    remove(this._renderSort());
  }

  _renderPoints() {
    this._sortedPoints.forEach((point) => (this._renderPoint(point)));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};

    remove(this._sortComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    const pointsCount = this._getPoints().length;

    if (!pointsCount) {
      this._renderNoPoints();
    }

    remove(this._noPointsComponent);
    this._renderTripInfo();
    this._renderTotalPrice();
    this._renderSort();
    this._renderPointsList();
    this._renderPoints();
  }
}
