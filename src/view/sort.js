import AbstractView from './abstract.js';
import {SortType} from '../utils/const.js';

const createSortTypeMarkup = (sortType) => {
  const isDisabled = (sortType === SortType.EVENT || sortType === SortType.OFFERS) ? 'disabled' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"
        ${isDisabled}>
        <label class="trip-sort__btn" for="sort-${sortType}" data-sort-type="${sortType}">${sortType}</label>
      </div>`
  );
};

const createSortingTemplate = (sortTypes) => {
  const sortTypesList = sortTypes.map((sortType) => createSortTypeMarkup(sortType)).join('\n');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortTypesList}
     </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(sortTypes) {
    super();
    this._sortTypes = sortTypes;
    this._currentSortType = SortType.DEFAULT;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._setActiveCurrentSortType(this._currentSortType);
  }

  getTemplate() {
    return createSortingTemplate(this._sortTypes);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL' || evt.target.parentElement.querySelector('input').hasAttribute('disabled')) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this._currentSortType = evt.target.dataset.sortType;

    this._setActiveCurrentSortType(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _setActiveCurrentSortType(currentSortType) {
    this.getElement().querySelector(`#sort-${currentSortType}`).checked = true;
  }
}
