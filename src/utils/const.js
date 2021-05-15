import {nanoid} from 'nanoid';
import {addDays} from '../utils/date.js';

const BLANK_DESTINATION = {
  name: '',
  description: '',
  photos: [],
};

export const BLANK_POINT = {
  id: nanoid(),
  isNew: true,
  start: new Date(),
  end: new Date(addDays(new Date())),
  type: 'taxi',
  offersByType: [],
  price: '',
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
  INIT: 'INIT',
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
  TYPE: 'type',
  TIMESPEND: 'time-spend',
};

export const TRANSFERS = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
];

export const ACTIVITIES = [
  'check-in',
  'restaurant',
  'sightseeing',
];
