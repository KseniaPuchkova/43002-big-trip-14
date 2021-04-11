import {formatMonthDay} from '../utils/date.js';

const getTripRoutes = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.city).join(' - ');
  }
  return points[0].city + ' - ... - ' + points[points.length - 1].city;
};

export const createTripInfoTemplate = (points) => {
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
