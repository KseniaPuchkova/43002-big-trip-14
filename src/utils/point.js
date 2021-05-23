import {SortType} from '../utils/const.js';
import {formatMonthDay, formatMonth, formatDay} from '../utils/date.js';

export const getTripPoints = (points) => {
  if (points.length <= 3) {
    return points.map((point) => point.destination.name).join(' - ');
  }

  return points[0].destination.name + ' - ... - ' + points[points.length - 1].destination.name;
};

export const getStartPoint = (points) => {
  const startPoint = formatMonthDay(points[0].start);

  return startPoint;
};

export const getEndPoint = (points) => {
  const endPoint = formatMonth(points[0].start) !== formatMonth(points[points.length - 1].end)
    ? formatMonthDay(points[points.length - 1].end) : formatDay(points[points.length - 1].end);

  return endPoint;
};

export const getTotalPrice = (points = []) => {
  return points.reduce((totalAcc, point) => {
    const price = point.offers.reduce((acc, offer) => acc + (offer ? offer.price : 0), 0);
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
