import FilterView from '../view/filters.js';
import {RenderPosition, FilterType, UpdateType} from '../utils/const.js';
import {render, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';

export default class Filter {
  constructor(tripControlsFiltersElement, filterModel, pointsModel) {
    this._tripControlsFiltersElement = tripControlsFiltersElement;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(isFiltersDisabled = false) {
    const filters = this._getFilters(isFiltersDisabled);
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.get());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._tripControlsFiltersElement, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters(isFiltersDisabled) {
    const points = !isFiltersDisabled ? this._pointsModel.get() : [];
    return Object.values(FilterType).map((type) => ({type, name: type, count: filter[type](points).length}));
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.get() === filterType) {
      return;
    }

    this._filterModel.set(UpdateType.MAJOR, filterType);
  }
}
