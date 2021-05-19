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

export const isOnline = () => {
  return window.navigator.onLine;
};
