import {FilterType} from '../utils/const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => point.start.getTime() >= Date.now()),
  [FilterType.PAST]: (points) => points.filter((point) => point.start.getTime() < Date.now()),
};
