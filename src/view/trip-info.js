import AbstractView from './abstract.js';
import {formatMonthDay} from '../utils/date.js';

const getTripPoint = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.city).join(' - ');
  }

  return points[0].city + ' - ... - ' + points[points.length - 1].city;
};

const createTripInfoTemplate = (points) => {
  const tripPoints = points.length ? getTripPoint(points) : '';

  const getStartEndPoints = () => {
    if (!points.length) {
      return `<p class="trip-info__dates">${''}</p>`;
    }

    return `<p class="trip-info__dates">${formatMonthDay(points[0].start)}&nbsp;&mdash;&nbsp;${formatMonthDay(points[points.length - 1].end)}</p>`;
  };

  return (
    `<section class="trip-main__trip-info trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${tripPoints}</h1>
         ${getStartEndPoints()}
       </div>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createTripInfoTemplate(this._point);
  }
}
