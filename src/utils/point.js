import {SortType} from '../utils/const.js';
import {formatMonthDay} from '../utils/date.js';

export const getTripPoints = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.city).join(' - ');
  }

  return points[0].city + ' - ... - ' + points[points.length - 1].city;
};

export const getStartPoint = (points) => {
  const startPoint = formatMonthDay(points[0].start);

  return startPoint;
};

export const getEndPoint = (points) => {
  const endPoint = formatMonthDay(points[points.length - 1].end);

  return endPoint;
};

export const getTotalPrice = (points = []) => {
  return points.reduce((totalAcc, point) => {
    const price = point.offers.reduce((acc, offer) => acc + (offer.isChecked ? offer.price : 0), 0);
    const totalPrice = totalAcc + point.price + price;

    return totalPrice;
  }, 0);
};

export const getSortedItems = (items, sortType) => {
  let sortedItems = [];

  switch (sortType) {
    case SortType.DEFAULT:
      sortedItems = items.slice().sort((a, b) => a.start - b.start);
      break;
    case SortType.PRICE:
      sortedItems = items.slice().sort((a, b) => b.price - a.price);
      break;
    case SortType.TIME:
      sortedItems = items.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start));
      break;
  }

  return sortedItems;
};
