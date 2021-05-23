import {addDays} from '../utils/date.js';

const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v14';
export const AUTHORIZATION = 'Basic 7RUkyeQDQt6JBhJZOo17a';
export const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const SHOW_TIME = 5000;

export const BAR_HEIGHT = 55;

export const BLANK_POINT = {
  isNew: true,
  start: new Date(),
  end: new Date(addDays(new Date())),
  type: 'taxi',
  price: '',
  offers: [],
  isFavorite: false,
  destination: {
    name: '',
    description: '',
    photos: [],
  },
};

export const Transfer = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  TRANSPORT: 'transport',
  DRIVE: 'drive',
  FLIGHT: 'flight',
};

export const Activity = {
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
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

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
