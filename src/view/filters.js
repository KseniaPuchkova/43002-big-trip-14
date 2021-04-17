import {createElement} from '../utils/utils.js';

const createFilterMarkup = (filter) => {
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${filter.name}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.name}"
        ${filter.isChecked ? 'checked' : ''}
      />
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name.toUpperCase()}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersList = filters.map((filter) => createFilterMarkup(filter)).join('\n');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersList}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class EditPoint {
  constructor(filters) {
    this._filters = filters ;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
