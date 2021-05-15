import {nanoid} from 'nanoid';
import {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, getShuffleArray} from '../utils/common.js';

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

const generateRandomDate = () => {
  let startDate = new Date();
  let endDate = new Date();
  const sign = (getRandomBoolean()) ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);
  startDate.setDate(startDate.getDate() + diffValue);
  startDate.setHours(getRandomIntegerNumber(0, 23));
  startDate.setMinutes(getRandomIntegerNumber(0, 59));
  endDate.setDate(endDate.getDate() + diffValue);
  endDate.setHours(getRandomIntegerNumber(0, 23));
  endDate.setMinutes(getRandomIntegerNumber(0, 59));
  if (startDate > endDate) {
    endDate = [startDate, startDate = endDate][0];
  }

  return {startDate, endDate};
};

const generatePhotos = (min, max) => {
  const photos = [];
  new Array((getRandomIntegerNumber(min, max))).fill('').forEach(() => {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  });

  return photos;
};

export const generateDestination = (city) => {
  const name = city ? city : getRandomArrayItem(CITIES);
  const destination = {
    name,
    description: getShuffleArray(DESCRIPTIONS, Description.MIN, Description.MAX).join(' '),
    photos: generatePhotos(Photo.MIN, Photo.MAX),
  };

  return destination;
};

export const generateDestinationsMap = () => {
  const destinations = [];
  CITIES.forEach((city) => destinations[city] = {
    name: city,
    description: getShuffleArray(DESCRIPTIONS, Description.MIN, Description.MAX).join(' '),
    photos: generatePhotos(Photo.MIN, Photo.MAX),
  });

  return destinations;
};

export const generateOffersMap = (types) => {
  const offers = [];

  types.forEach((type) => offers[type] = getShuffleArray(OFFERS.map((offer) =>
    ({
      name: offer.name,
      title: offer.title,
      price: getRandomIntegerNumber(Price.MIN, Price.MAX),
      isChecked: getRandomBoolean(),
    }))));

  return offers;
};

export const generatePoint = () => {
  const id = nanoid();
  const randomDate = generateRandomDate();
  const start = randomDate.startDate;
  const end = randomDate.endDate;
  const type = getRandomArrayItem([...TRANSFERS, ...ACTIVITIES]);
  const offersByType = generateOffersMap([...TRANSFERS, ...ACTIVITIES])[type];
  const city = getRandomArrayItem(CITIES);
  const destination = generateDestination(city);
  //const destination = {};
  const price = getRandomIntegerNumber(Price.MIN, Price.MAX);
  const isFavorite = getRandomBoolean();
  const isNew = false;

  return {
    id,
    start,
    end,
    type,
    offersByType,
    city,
    destination,
    price,
    isFavorite,
    isNew,
  };
};

export const generatePoints = (count = 0) => new Array(count).fill('').map(generatePoint);
