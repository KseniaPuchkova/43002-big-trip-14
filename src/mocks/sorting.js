import {SortType} from '../utils/const.js';

const generateSortingTypes = () => {
  return ([
    SortType.DEFAULT,
    SortType.TIME,
    SortType.PRICE,
  ]);
};

export {generateSortingTypes, SortType};
