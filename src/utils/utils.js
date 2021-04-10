const getRandomBoolean = () => Math.random() > 0.5;


const getRandomIntegerNumber = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};


const getShuffleArray = (array, min = 0, max = array.length) => {
  return array.slice().sort(() => Math.random() - 0.5).slice(0, getRandomIntegerNumber(min, max));
};


const generateNewArray = (array, functionName, count = 1) => {
  const newArray = [];

  array.forEach((elem) => {
    newArray[elem] = Array(count).fill().map(() => functionName);
  });

  return newArray;
};


const getPreposition = (array, type) => array.includes(type) ? 'to' : 'in';


const generateObjectKeys = (object) => {
  const objectKeys = [];

  for (let i = 0; i <= 10; i++) {
    objectKeys.push(getRandomArrayItem(Object.keys(object)));
  }

  return objectKeys;
};


const getRandomLengthArray = (min, max) => new Array(getRandomIntegerNumber(min, max)).fill('');

export {getRandomBoolean, getRandomIntegerNumber, getRandomArrayItem, getShuffleArray, generateNewArray, generateObjectKeys, getPreposition, getRandomLengthArray};
