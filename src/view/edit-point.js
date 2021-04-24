import AbstractView from './abstract.js';
import {CITIES, TRANSFERS, ACTIVITIES} from '../utils/const.js';
import {getPreposition} from '../utils/common.js';
import {formatValueDate} from '../utils/date.js';

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

const generateInfoMarkup = (info) => {
  const {description, photos} = info;

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
    .map((offer, index) => {
      const {name, title, price} = offer;

      return (
        `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-${index}" type="checkbox" name="event-offer-${name}">
        <label class="event__offer-label" for="event-offer-${name}-${index}">
          <span class="event__offer-title">${title}</span>
          +
          €&nbsp;<span class="event__offer-price">${price}</span>
        </label>
       </div>`
      );
    })
    .join('\n');
};

const createOffersMarkup = (offers) => {
  if (!offers.length) {
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


const createEditPointTemplate = (point = {}) => {
  const {type, city, info, price, offers, start, end} = point;

  const transfersList = createTypesMarkup(type, TRANSFERS);
  const activitiesList = createTypesMarkup(type, ACTIVITIES);
  const citiesMarkup = createCitiesMarkup();
  const offersListContainer = createOffersMarkup(offers);
  const infoMarkup = generateInfoMarkup(info);
  const preposition = getPreposition(TRANSFERS, type);
  const rollUpButton = createRollUpButton(point);

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

export default class EditPoint extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._editPointButtonClickHandler = this._editPointButtonClickHandler.bind(this);
    this._editPointSubmitHandler = this._editPointSubmitHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  _editPointButtonClickHandler() {
    this._callback.click();
  }

  _editPointSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._point);
    console.log(this._point);
  }

  setEditPointButtonClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editPointButtonClickHandler);
  }

  setEditPointSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._editPointSubmitHandler);
  }
}


