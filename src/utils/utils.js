const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

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

const generateNewArray = (array1, array2) => {
  const newArray = [];

  array1.forEach((elem) => {
    newArray[elem] = getShuffleArray(array2);
  });

  return newArray;
};

const generateNewObject = (city, functionName) => {
  const newObject = {};

  newObject[city] = functionName;

  return newObject;
};

const getPreposition = (array, type) => array.includes(type) ? 'to' : 'in';

const getTotalPrice = (array) => {
  return array.reduce((totalAcc, point) => {
    const price = point.offers.reduce((acc, offer) => acc + offer.price, 0);
    const totalPrice = totalAcc + point.price + price;

    return totalPrice;
  }, 0);
};

function render(container, template, position) {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;

    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
  }
}

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
}

export {
  getRandomBoolean,
  getRandomIntegerNumber,
  getRandomArrayItem,
  getShuffleArray,
  generateNewArray,
  generateNewObject,
  getPreposition,
  getTotalPrice,
  render,
  createElement,
  RenderPosition
};
