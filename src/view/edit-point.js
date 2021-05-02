import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart.js';
import {CITIES, TRANSFERS, ACTIVITIES} from '../utils/const.js';
import {getPreposition, generateNewArray, generateNewObject} from '../utils/common.js';
import {formatValueDate} from '../utils/date.js';
import {generateOffers, generateInfo} from '../mocks/point.js';

const BLANK_POINT = {
  start: new Date,
  end: new Date,
  city: '',
  type: 'taxi',
  offers: [],
  day: new Date,
  price: '',
  isFavorite: false,
  info: {},
};

const createCitiesMarkup = () => {
  return CITIES.map((city) => {
    return `<option value="${city}"></option>`;
  })
    .join('\n');
};

const createPhotosListMarkup = (photo) => {
  return (
    `<img class="event__photo" src="${photo}" alt="Event photo">`
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
  if (!description) {
    return '';
  }

  return (
    `<p class="event__destination-description">${description}</p>`
  );
};

const generateInfoMarkup = ({ description, photos }) => {
  if (!description && !photos.length) {
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

const createTypesMarkup = (activeType, types) => {
  return types
    .map((type, index) => {
      const isChecked = (activeType === type) ? 'checked' : '';
      return (
        `<div class="event__type-item">
          <input id="event-type-${type.toLowerCase()}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.toLowerCase()}" ${isChecked}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${index}">${type}</label>
        </div>`
      );
    })
    .join('\n');
};

const createOfferListMarkup = (offers) => {
  return offers
    .map(({ name, title, price, isChecked }, index) => {
      return (
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-${index}" type="checkbox" name="event-offer-${name}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${title}" data-title="${title}">
          <span class="event__offer-title">${title}</span>
          +
          €&nbsp;<span class="event__offer-price">${price}</span>
        </label>
       </div>`
      );
    })
    .join('\n');
};

const createOffersMarkup = (isOffers, offers) => {
  if (!isOffers) {
    return '';
  }
  const offersList = createOfferListMarkup(offers);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersList}
        </div>
    </section>`
  );
};

const createRollUpButton = (point) => {
  return (point.id !== 'new') ? (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`) : '';
};


const createEditPointTemplate = (data = {}) => {
  const {type, city, info, price, offers, start, end, isOffers} = data;

  const transfersList = createTypesMarkup(type, TRANSFERS);
  const activitiesList = createTypesMarkup(type, ACTIVITIES);
  const citiesMarkup = createCitiesMarkup();
  const offersListContainer = createOffersMarkup(isOffers, offers);
  const infoMarkup = generateInfoMarkup(info);
  const preposition = getPreposition(TRANSFERS, type);
  const rollUpButton = createRollUpButton(data);

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${citiesMarkup}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatValueDate(start)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatValueDate(end)}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          ${rollUpButton}
        </header>
        <section class="event__details">
          ${offersListContainer}
          ${infoMarkup}
        </section>
      </form>
    </li>`
  );
};

export default class EditPoint extends SmartView {
  constructor(data = BLANK_POINT) {
    super();
    this._data = data;
    this._stateData = EditPoint.parseDataToState(data);
    this._offers = this._stateData.offers.slice();
    this._startDatepicker = null;
    this._endDatepicker = null;

    this._buttonCloseClickHandler = this._buttonCloseClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  getTemplate() {
    return createEditPointTemplate(this._stateData);
  }

  _setInnerHandlers() {
    if (this._stateData.isOffers) {
      this.getElement().querySelector('.event__available-offers').addEventListener('click', this._offersChangeHandler);
    }
    this.getElement().querySelector('.event__type-list').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._cityChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
  }

  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._destroyStartDatepicker();
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
      this._destroyEndDatepicker();
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
    this.updateState({
      start: userDate,
    }, true);

    this._endDatepicker.set('minDate', userDate);
    this._endDatepicker.set('minTime', userDate);

    if (this._stateData.start <= userDate) {
      this._endDatepicker.setDate(userDate);
      this._stateData.start = userDate;

      this.updateState({
        start: userDate,
      }, true);
    }
  }

  _endDateChangeHandler([userDate]) {
    this.updateState({
      end: userDate,
    }, true);
  }

  _offersChangeHandler(evt) {
    event.preventDefault();

    if (evt.target.closest('.event__offer-label')) {
      const title = evt.target.closest('.event__offer-label').dataset.title;
      const index = this._stateData.offers.findIndex((offer) => offer.title === title);
      this._offers[index].isChecked = !this._offers[index].isChecked;

      this.updateState({
        offers: this._offers,
      }, false);
    }
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateState({
      type: evt.target.value,
      offers: generateNewArray([...TRANSFERS, ...ACTIVITIES], generateOffers())[evt.target.value],
    }, false);
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateState({
      city: evt.target.value,
      info: generateNewObject(evt.target.value, generateInfo())[evt.target.value],
    }, false);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    if (!Number.isNaN(parseInt(evt.target.value)) && parseInt(evt.target.value) > 0) {
      evt.target.setCustomValidity('');
      this.updateState({
        price: evt.target.value,
      }, true);
    } else {
      evt.target.setCustomValidity('Please input some positive number');
      return;
    }
  }

  _buttonCloseClickHandler() {
    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EditPoint.parseStateToDate(this._stateData));
  }

  _destroyStartDatepicker() {
    this._startDatepicker.destroy();
    this._startDatepicker = null;
  }

  _destroyEndDatepicker() {
    this._endDatepicker.destroy();
    this._endDatepicker = null;
  }

  setButtonCloseClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonCloseClickHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._submitHandler);
  }

  restoreHandlers() {
    this.setButtonCloseClickHandler(this._callback.click);
    this.setSubmitHandler(this._callback.submit);
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
        isOffers: point.offers.length,
        info: point.info = {
          description: point.info.description,
          photos: point.info.photos,
        },
      },
    );
  }

  static parseStateToDate(data) {
    data = Object.assign({}, data);

    delete data.isOffers;

    return data;
  }
}
