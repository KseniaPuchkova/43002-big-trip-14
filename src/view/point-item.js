import AbstractView from './abstract.js';

const createPointItemTemplate = () => {
  return (
    `<li class="trip-events__item">
    </li>`
  );
};

export default class PointItem extends AbstractView {
  getTemplate () {
    return createPointItemTemplate();
  }
}
