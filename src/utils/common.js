export const getRandomBoolean = () => Math.random() > 0.5;

export const getRandomIntegerNumber = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const getShuffleArray = (array, min = 0, max = array.length) => {
  return array.slice().sort(() => Math.random() - 0.5).slice(0, getRandomIntegerNumber(min, max));
};

export const generateNewArray = (array1, array2) => {
  const newArray = [];

  array1.forEach((elem) => newArray[elem] = getShuffleArray(array2));

  return newArray;
};

export const generateNewObject = (city, functionName) => {
  const newObject = {};

  newObject[city] = functionName;

  return newObject;
};

export const getPreposition = (array, type) => array.includes(type) ? 'to' : 'in';

export const getTotalPrice = (array) => {
  return array.reduce((totalAcc, point) => {
    const price = point.offers.reduce((acc, offer) => acc + offer.price, 0);
    const totalPrice = totalAcc + point.price + price;

    return totalPrice;
  }, 0);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
