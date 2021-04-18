import AbstractView from './abstract.js';

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

export default class EditPoint extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
