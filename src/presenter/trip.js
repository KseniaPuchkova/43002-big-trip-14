import SortView  from '../view/sort.js';
import PointsListView  from '../view/points-list.js';
import PointPresenter from './point.js';
import NoPointsView  from '../view/no-points.js';
import {SORT_TYPES} from '../utils/const.js';
import {RenderPosition, render} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenters = {};

    this._sortComponent = new SortView(SORT_TYPES);
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _renderPointsList() {
    render(this._tripContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _clearPointsList() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoints() {
    this._points.forEach((point) => (this._renderPoint(point)));
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
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
