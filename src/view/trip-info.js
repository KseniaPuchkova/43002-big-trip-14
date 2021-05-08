import AbstractView from './abstract.js';
import {getTripPoints, getStartPoint, getEndPoint} from '../utils/point.js';

const createTripInfoTemplate = (points) => {
  const tripPoints = points.length ? getTripPoints(points) : '';

  const getStartEndPoints = () => {
    if (!points.length) {
      return `<p class="trip-info__dates">${''}</p>`;
    }

    const startPoint = getStartPoint(points);
    const endPoint = getEndPoint(points);

    return `<p class="trip-info__dates">${startPoint}&nbsp;&mdash;&nbsp;${endPoint}</p>`;
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
