import {nanoid} from 'nanoid';
import {TRANSFERS, ACTIVITIES, CITIES, OFFERS, DESCRIPTIONS, Price, Photo, Description} from '../utils/const.js';
import {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, getShuffleArray} from '../utils/common.js';

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
  const offers = generateOffersMap([...TRANSFERS, ...ACTIVITIES])[type];
  const city = getRandomArrayItem(CITIES);
  const destination = generateDestination(city);
  const price = getRandomIntegerNumber(Price.MIN, Price.MAX);
  const isFavorite = getRandomBoolean();
  const isNew = false;

  return {
    id,
    start,
    end,
    type,
    offers,
    city,
    destination,
    price,
    isFavorite,
    isNew,
  };
};

export const generatePoints = (count = 0) => new Array(count).fill('').map(generatePoint);
