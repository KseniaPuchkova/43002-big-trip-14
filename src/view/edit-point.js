import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart.js';
import {TRANSFERS, ACTIVITIES} from '../utils/const.js';
import {BLANK_POINT} from '../utils/point.js';
import {formatValueDate} from '../utils/date.js';

const createDestinationsMarkup = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination}"></option>`;
  }).join('\n');
};

const createPhotosListMarkup = (photo) => {
  const {src, description} = photo;
  return (
    `<img class="event__photo" src="${src}" alt="${description}">`
  );
};

const createPhotosMarkup = (photos) => {
  if (!photos.length) {
    return '';
  }

  const photosList = photos.map((photo) => createPhotosListMarkup(photo)).join('\n');

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
         ${photosList}
      </div>
    </div>`
  );
};

const createDescriptionMarkup = (description) => {
  if (!description.length) {
    return '';
  }

  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

const generateDestinationMarkup = (destination) => {
  const {description, photos} = destination;

  if (!description.length && !photos.length) {
    return '';
  }
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionMarkup(description)}
      ${createPhotosMarkup(photos)}
    </section>`
  );
};

const createTypesMarkup = (activeType, types, isDisabled) => {
  return types
    .map((type, index) => {
      const isChecked = (activeType === type) ? 'checked' : '';
      return (
        `<div class="event__type-item">
          <input id="event-type-${type.toLowerCase()}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked} ${isDisabled ? 'disabled' : ''}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${index}">${type}</label>
        </div>`
      );
    })
    .join('\n');
};

const createOfferListMarkup = (offers, isDisabled) => {
  return offers
    .map(({title, price, isChecked}, index) => {
      return (
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-name-${index}" type="checkbox" name="event-offer-name" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${title.toLowerCase()}" data-title="${title}">
          <span class="event__offer-title">${title}</span>
          +
          €&nbsp;<span class="event__offer-price">${price}</span>
        </label>
       </div>`
      );
    })
    .join('\n');
};

const createOffersMarkup = (offers, isDisabled) => {
  if (!offers.length) {
    return '';
  }
  const offersList = createOfferListMarkup(offers, isDisabled);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersList}
        </div>
    </section>`
  );
};

const createRollUpButton = (isPointNew) => {
  if (isPointNew) {
    return '';
  }
  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
     </button>`
  );
};

const createEditPointTemplate = (data = {}, destinations) => {
  const {start, end, destination, type, offers, price, isNew, isDisabled, isSaving, isDeleting} = data;
  const destinationNames = destinations.map((destination) => destination.name);
  const destinationsList = createDestinationsMarkup(destinationNames);
  const destinationMarkup = generateDestinationMarkup(destination);
  const offersListContainer = createOffersMarkup(offers, isDisabled);
  const transfersList = createTypesMarkup(type, TRANSFERS);
  const activitiesList = createTypesMarkup(type, ACTIVITIES);
  const preposition = TRANSFERS.includes(type) ? 'to' : 'in';
  const rollUpButton = createRollUpButton(isNew);

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transfersList}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activitiesList}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} ${preposition}
            </label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name ? he.encode(destination.name) : ''}" list="destination-list-1" autocomplete="on" required ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinationsList}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatValueDate(start)}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatValueDate(end)}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" required value="${price ? he.encode(String(price)) : ''}" ${isDisabled ? 'disabled' : ''}>
        </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled || isDisabled ? 'disabled' : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${isNew ? 'Cancel' : isDeleting ? 'Deleting...' : 'Delete'}
          </button>
            ${rollUpButton}
        </header>
        <section class="event__details">
          ${offersListContainer}
          ${destinationMarkup}
        </section>
      </form>
    </li>`
  );
};

export default class EditPoint extends SmartView {
  constructor(data = BLANK_POINT, destinations, offers) {
    super();
    this._data = data;
    this._stateData = EditPoint.parseDataToState(this._data);
    this._destinations = destinations;
    this._offers = offers;
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._currentUserDate = null;

    this._buttonCloseClickHandler = this._buttonCloseClickHandler.bind(this);
    this._buttonDeleteClickHandler = this._buttonDeleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker || this._endDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  getTemplate() {
    return createEditPointTemplate(this._stateData, this._destinations, this._offers);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        mode: 'single',
        enableTime: true,
        altInput: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        altFormat: 'd/m/y H:i',
        defaultDate: this._stateData.start,
        onChange: this._startDateChangeHandler,
      },
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        mode: 'single',
        enableTime: true,
        altInput: true,
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        altFormat: 'd/m/y H:i',
        defaultDate: this._stateData.end,
        minDate: this._stateData.start,
        onChange: this._endDateChangeHandler,
      },
    );
  }

  _startDateChangeHandler([userDate]) {
    this._currentUserDate = userDate;
    this._endDatepicker.set('minDate', userDate);
    this._endDatepicker.set('minTime', userDate);

    if (this._currentUserDate <= userDate && this._stateData.end <= userDate) {
      this._endDatepicker.setDate(userDate);
      this._startDatepicker.setDate(userDate);
      this._currentUserDate = userDate;
    }

    this.updateState({
      start: userDate,
    }, true);
  }

  _endDateChangeHandler([userDate]) {
    this._startDatepicker.set('maxDate', userDate);

    this.updateState({
      end: userDate,
    }, true);
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const currentDestination = evt.target.value;
    const destination = this._destinations.find((destination) => destination.name === currentDestination);

    if (!destination || !currentDestination) {
      evt.target.setCustomValidity('Please select the city from the list');
      return;
    } else {
      evt.target.setCustomValidity('');
      this.updateState({
        destination,
      }, false);
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    const type = evt.target.textContent;
    const offers = this._offers.find((offer) => offer.type === type).offers;

    if (offers) {
      this.updateState({
        type,
        offers,
      }, false);
    }
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    const title = evt.target.closest('label').dataset.title;
    const index = this._stateData.offers.findIndex((offer) => offer.title === title);
    const offers = this._stateData.offers.slice();

    this.updateState({
      offers: Object.assign(
        [],
        offers,
        offers[index].isChecked = !offers[index].isChecked,
      ),
    }, false);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    if (Number.isNaN(parseInt(evt.target.value, 10)) || (parseInt(evt.target.value, 10) <= 0) || evt.target.value.length === 0) {
      evt.target.setCustomValidity('Please input some positive number');
      return;
    } else {
      evt.target.setCustomValidity('');
      this.updateState({
        price: parseInt(evt.target.value, 10),
      }, true);
    }
  }

  _buttonCloseClickHandler() {
    this._callback.closeClick();
  }

  _buttonDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseStateToDate(this._stateData));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPoint.parseStateToDate(this._stateData));
  }

  _setInnerHandlers() {
    if (this._stateData.offers.length) {
      this.getElement().querySelectorAll('.event__offer-selector').forEach((offer) =>
        offer.addEventListener('click', this._offersChangeHandler));
    }

    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._destinationChangeHandler);
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._typeChangeHandler);
  }

  setButtonCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    if (!this._stateData.isNew) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonCloseClickHandler);
    }
  }

  setButtonDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonDeleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  restoreHandlers() {
    this.setButtonCloseClickHandler(this._callback.closeClick);
    this.setButtonDeleteClickHandler(this._callback.deleteClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  reset(point) {
    this.updateState(
      EditPoint.parseDataToState(point),
    );
  }

  static parseDataToState(point) {
    return Object.assign(
      {},
      point,
      {
        offers: point.offers.map((obj) => ({ ...obj})),
        destination: {
          name: point.destination.name,
          description: point.destination.description,
          photos: point.destination.photos,
        },
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }


  static parseStateToDate(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isNew;

    return data;
  }
}
