import AbstractView from './abstract.js';
import {SortType} from '../utils/const.js';

const createSortTypeMarkup = (currentSortType, sortType) => {
  const isDisabled = (sortType === SortType.EVENT || sortType === SortType.OFFERS) ? 'disabled' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"
        ${currentSortType === sortType ? 'checked' : ''} ${isDisabled}>
        <label class="trip-sort__btn" for="sort-${sortType}" data-sort-type="${sortType}">${sortType}</label>
      </div>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortTypesList = Object.values(SortType).map((sortType) => createSortTypeMarkup(currentSortType, sortType)).join('');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortTypesList}
     </form>`
  );
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL' || evt.target.parentElement.querySelector('input').hasAttribute('disabled')) {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
