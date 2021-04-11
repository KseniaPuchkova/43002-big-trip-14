import {TRANSFERS, ACTIVITIES, CITIES, OFFERS, DESCRIPTIONS, Price, Offer, Photo, Description} from '../utils/const.js';
import {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, getShuffleArray, generateNewArray, generateNewObject} from '../utils/utils.js';

const generateOffers = () => {
  const offers = OFFERS.map((offer) =>
    ({
      name: offer.name,
      title: offer.title,
      price: getRandomIntegerNumber(Offer.MIN, Offer.MAX),
      isChecked: getRandomBoolean(),
    }));
  return offers;
};

const generatePhotos = (min, max) => {
  const photos = [];
  new Array((getRandomIntegerNumber(min, max))).fill('').forEach(() => {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  });

  return photos;
};

const generateInfo = () => {
  return {
    description: getShuffleArray(DESCRIPTIONS, Description.MIN, Description.MAX).join(' '),
    photos: generatePhotos(Photo.MIN, Photo.MAX),
  };
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

const generatePoint = () => {
  const randomDate = generateRandomDate();
  const start = randomDate.startDate;
  const end = randomDate.endDate;
  const day = randomDate.startDate.toDateString().slice(4, 15);
  const type = getRandomArrayItem([...TRANSFERS, ...ACTIVITIES]);
  const offers = generateNewArray([...TRANSFERS, ...ACTIVITIES], generateOffers())[type];
  const city = getRandomArrayItem(CITIES);
  const info = generateNewObject(city, generateInfo())[city];
  const price = getRandomIntegerNumber(Price.MIN, Price.MAX);
  const isFavorite = getRandomBoolean();

  return {
    id: String(new Date() + Math.random()),
    start,
    end,
    city,
    type,
    offers,
    day,
    price,
    isFavorite,
    info,
  };
};

const generatePoints = (count) => new Array(count)
  .fill('')
  .map(generatePoint)
  .slice()
  .sort((a, b) => a.start - b.start);

export {generatePoints};
