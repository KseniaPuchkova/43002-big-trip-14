import Abstract from './abstract.js';

const createButtonNewTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
        New event
     </button>`
  );
};

export default class ButtonNew extends Abstract {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  getTemplate() {
    return createButtonNewTemplate();
  }

  setButtonClickHandler(callback) {
    this._callback._click = callback;
    this.getElement().addEventListener('click', this._buttonClickHandler);
  }

  addDisabled() {
    this.getElement().disabled = true;
  }

  removeDisabled() {
    this.getElement().disabled = false;
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback._click(evt.target.value);
  }
}
