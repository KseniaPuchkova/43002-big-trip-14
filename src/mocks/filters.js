import {FILTERS} from '../utils/const.js';

const generateFilters = () => {
  const filters = FILTERS.map((name, i) => ({name, isChecked: i === 0}));

  return filters;
};

export {generateFilters};
