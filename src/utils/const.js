const TRANSFERS = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
];

const ACTIVITIES = [
  'check-in',
  'restaurant',
  'sightseeing',
];

const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Saint Petersburg',
];

const DESCRIPTIONS = [
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

const OFFERS = [
  {name: 'luggage', title: 'Add luggage'},
  {name: 'comfort', title: 'Switch to comfort'},
  {name: 'train', title: 'Travel by train'},
  {name: 'meal', title: 'Add meal'},
  {name: 'seats', title: 'Choose seats'},
  {name: 'tickets', title: 'Book tickets'},
];

const FILTERS = ['everything', 'future', 'past'];

const SortType = {
  DEFAULT: 'event',
  TIME: 'time',
  PRICE: 'price',
};

const SORT_TYPES = Object.values(SortType);

const Description = {
  MIN: 0,
  MAX: 10,
};

const Offer = {
  MIN: 0,
  MAX: 5,
};

const Photo = {
  MIN: 0,
  MAX: 10,
};

const Price = {
  MIN: 10,
  MAX: 1000,
};

export {
  TRANSFERS,
  ACTIVITIES,
  CITIES,
  DESCRIPTIONS,
  OFFERS,
  FILTERS,
  SORT_TYPES,
  SortType,
  Price,
  Offer,
  Photo,
  Description
};
