import {createElement} from '../utils/utils.js';
import {formatMonthDay} from '../utils/date.js';

const getTripRoutes = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.city).join(' - ');
  }

  return points[0].city + ' - ... - ' + points[points.length - 1].city;
};

const createTripInfoTemplate = (points) => {
  if (!points.length) {

    return (
      `<section class="trip-main__trip-info trip-info">
         <div class="trip-info__main">
           <h1 class="trip-info__title"></h1>
           <p class="trip-info__dates"></p>
         </div>
      </section>`
    );
  }

  return (
    `<section class="trip-main__trip-info trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${getTripRoutes(points)}</h1>
         <p class="trip-info__dates">${formatMonthDay(points[0].start)}&nbsp;&mdash;&nbsp;${formatMonthDay(points[points.length - 1].end)}</p>
       </div>
    </section>`
  );
};


export default class TripInfo {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._point);
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
