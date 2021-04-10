import {CITIES, TRANSFERS, ACTIVITIES} from '../utils/const.js';
import {getPreposition} from '../utils/utils.js';
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
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${index}" type="checkbox" name="event-offer-${title}">
        <label class="event__offer-label" for="event-offer-${title}-${index}">
          <span class="event__offer-title">${name}</span>
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
  const {type, city, info, price, offers, start, end, isFavorite} = point;

  const transfersList = createTypesMarkup(type, TRANSFERS);
  const activitiesList = createTypesMarkup(type, ACTIVITIES);
  const citiesMarkup = createCitiesMarkup();
  const offersListContainer = createOffersMarkup(offers);
  const infoMarkup = generateInfoMarkup(...info);
  const preposition = getPreposition(TRANSFERS, type);
  const rollUpButton = createRollUpButton(point);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
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
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? 'checked' : ''}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        ${rollUpButton}
      </header>
      <section class="event__details">
        ${offersListContainer}
        ${infoMarkup}
      </section>
    </form>`
  );
};

export {createEditPointTemplate};

