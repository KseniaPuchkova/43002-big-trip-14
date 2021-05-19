import TripInfoView  from '../view/trip-info.js';
import TotalPriceView  from '../view/total-price.js';
import LoadingView from '../view/loading.js';
import SortView  from '../view/sort.js';
import PointsListView  from '../view/points-list.js';
import NoPointsView  from '../view/no-points.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {RenderPosition, render, remove, showContainerlineElement, hideContainerlineElement} from '../utils/render.js';
import {getSortedItems, getTotalPrice} from '../utils/point.js';
import {SortType, FilterType, UpdateType, UserAction} from '../utils/const.js';
import {filter} from '../utils/filter.js';

export default class Trip {
  constructor(tripMainElement, tripEventsElement, buttonNewComponent, pointsModel, filterModel, destinationsModel, offersModel, api) {
    this._tripMainElement = tripMainElement;
    this._tripEventsElement = tripEventsElement;
    this._buttonNewComponent = buttonNewComponent;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._isLoading = true;

    this._pointPresenters = {};

    this._noPointsComponent = new NoPointsView();
    this._pointsListComponent = new PointsListView();
    this._loadingComponent = new LoadingView();
    this._tripInfoComponent = null;
    this._totalPriceComponent = null;
    this._sortComponent = null;

    this._currentSortType = SortType.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._buttonNewComponent, this._handleViewAction, this._destinationsModel, this._offersModel);
  }

  init() {
    this._renderTrip();

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
  }

  createPoint() {
    this.restoreDefaults();

    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
    }

    this._pointNewPresenter.init();
  }

  destroy() {
    this._clearTrip({isResetSortType: true});

    remove(this._noPointsComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
  }

  restoreDefaults() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  showTripline() {
    showContainerlineElement();
  }

  hideTripline() {
    hideContainerlineElement();
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
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType,response);
          })
          .catch(() => {
            this._pointPresenters[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType,response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenters[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenters[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this.showTripline();
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _renderLoading() {
    render(this._tripEventsElement, this._loadingComponent, RenderPosition.AFTERBEGIN);
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

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderPointsList() {
    render(this._tripEventsElement, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange, this._destinationsModel, this._offersModel);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderNoPoints() {
    this.hideTripline();
    render(this._tripEventsElement, this._noPointsComponent, RenderPosition.AFTERBEGIN);
    remove(this._sortComponent);
  }

  _renderPoints() {
    this._sortedPoints.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsElement, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _clearPointsPresenters() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      this.hideTripline();
      return;
    }

    if (this._getPoints().length === 0) {
      this._renderNoPoints();

      remove(this._tripInfoComponent);
      remove(this._totalPriceComponent);
      return;
    }

    remove(this._noPointsComponent);

    this.showTripline();

    this._renderTripInfo();
    this._renderTotalPrice();
    this._renderSort();
    this._renderPointsList();
    this._renderPoints();
  }
}
