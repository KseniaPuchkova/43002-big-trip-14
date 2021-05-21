import AbstractView from './abstract.js';
import {formatUTCDate, formatTime, formatMonthDay, formatDiffDate} from '../utils/date.js';
import {Transfer} from '../utils/const.js';

const generateOffersMarkup = (offers) => {
  if (offers.length) {
    return offers
      .map(({title, price, isChecked}) => {
        if (isChecked) {
          return (
            `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </li>`
          );
        }
      }).join('');
  }
  return '';
};

const createPointTemplate = (data = {}) => {
  const {start, end, destination, price, type, offers, isFavorite} = data;
  const offersList = generateOffersMarkup(offers);

  return (
    `<li class="trip-events__item">
       <div class="event">
         <time class="event__date" datetime="${formatMonthDay(start)}">${formatMonthDay(start)}</time>
         <div class="event__type">
           <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
         </div>
         <h3 class="event__title">${type} ${destination.name}</h3>
         <div class="event__schedule">
           <p class="event__time">
             <time class="event__start-time" datetime="${formatUTCDate(start)}">${formatTime(start)}</time>
             &mdash;
             <time class="event__end-time" datetime="${formatUTCDate(end)}">${formatTime(end)}</time>
           </p>
           <p class="event__duration">${formatDiffDate(start, end)}</p>
         </div>
         <p class="event__price">
           &euro;&nbsp;<span class="event__price-value">${price}</span>
         </p>
         <h4 class="visually-hidden">Offers:</h4>
         <ul class="event__selected-offers">
           ${offersList}
         </ul>
          <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
       </div>
     </li>`
  );
};

export default class Point extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
    this._buttonOpenClickHandler = this._buttonOpenClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._data);
  }

  setButtonOpenClickHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonOpenClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _buttonOpenClickHandler() {
    this._callback.openClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }
}

