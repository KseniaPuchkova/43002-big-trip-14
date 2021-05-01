import SortView  from '../view/sort.js';
import PointsListView  from '../view/points-list.js';
import PointPresenter from './point.js';
import NoPointsView  from '../view/no-points.js';
import {RenderPosition, render} from '../utils/render.js';
import {updateItem, getSortedItems} from '../utils/common.js';
import {SortType} from '../utils/const.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenters = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView(Object.values(SortType));
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sortedPoints = getSortedItems(this._points, SortType.DEFAULT);
    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsPresenters();
    this._renderPoints();
  }

  _sortPoints(sortType) {
    this._sortedPoints = getSortedItems(this._points, sortType);
    this._currentSortType = sortType;
  }

  _clearPointsPresenters() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _renderPointsList() {
    render(this._tripContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoints() {
    this._sortedPoints.forEach((point) => (this._renderPoint(point)));
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTrip() {
    if (!this._points.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointsList();
    this._renderPoints();
  }
}
