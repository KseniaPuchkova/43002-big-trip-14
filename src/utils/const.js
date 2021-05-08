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

export const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Saint Petersburg',
  'Moscow',
  'Madrid',
  'Milan',
  'Athens',
  'Vienna',
  'Paris',
];

export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

export const OFFERS = [
  {name: 'luggage', title: 'Add luggage'},
  {name: 'comfort', title: 'Switch to comfort'},
  {name: 'train', title: 'Travel by train'},
  {name: 'meal', title: 'Add meal'},
  {name: 'seats', title: 'Choose seats'},
  {name: 'tickets', title: 'Book tickets'},
];

export const Description = {
  MIN: 0,
  MAX: 10,
};

export const Offer = {
  MIN: 0,
  MAX: 5,
};

export const Photo = {
  MIN: 0,
  MAX: 10,
};

export const Price = {
  MIN: 10,
  MAX: 500,
};

