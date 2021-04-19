import AbstractView from './abstract.js';
import {formatMonthDay} from '../utils/date.js';

const getTripRoutes = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.city).join(' - ');
  }

  return points[0].city + ' - ... - ' + points[points.length - 1].city;
};

const createTripInfoTemplate = (points) => {
  const tripPoints = points ? getTripRoutes(points) : '';
  const pointStart = points ? formatMonthDay(points[0].start) : '';
  const pointEnd = points ? formatMonthDay(points[points.length - 1].end) : '';

  return (
    `<section class="trip-main__trip-info trip-info">
       <div class="trip-info__main">
         <h1 class="trip-info__title">${tripPoints}</h1>
         <p class="trip-info__dates">${pointStart}&nbsp;&mdash;&nbsp;${pointEnd}</p>
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
