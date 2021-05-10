import {nanoid} from 'nanoid';
import {addDays} from '../utils/date.js';

const BLANK_DESTINATION = {
  name: 'Moscow',
  description: '',
  photos: [],
};

export const BLANK_POINT = {
  id: nanoid(),
  isNew: true,
  start: new Date(),
  end: addDays(new Date()),
  type: 'taxi',
  offers: [],
  price: parseInt(0, 10),
  isFavorite: false,
  destination: BLANK_DESTINATION,
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const ChartName = {
  MONEY: 'money',
  TRANSPORT: 'transport',
  TIMESPEND: 'time-spend',
};
