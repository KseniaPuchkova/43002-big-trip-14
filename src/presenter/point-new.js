import {nanoid} from 'nanoid';
import EditPointView  from '../view/edit-point.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {RenderPosition, render, remove} from '../utils/render.js';

const BLANK_POINT = {
  id: nanoid(),
  isNew: true,
  start: new Date(),
  end: new Date(),
  city: 'Moscow',
  type: 'taxi',
  offers: [],
  day: new Date(),
  price: parseInt(0),
  isFavorite: false,
  info: {
    description: [],
    photos: [],
  },
};

export default class PointNew {
  constructor(pointContainer, changeData, tripPointAddButtonElement) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._tripPointAddButtonElement = tripPointAddButtonElement;

    this._editPointComponent = null;

    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._editPointComponent !== null) {
      return;
    }

    this._editPointComponent = new EditPointView(BLANK_POINT);
    this._editPointComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._editPointComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);

    this._tripPointAddButtonElement.disabled = true;

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    remove(this._editPointComponent);
    this._editPointComponent = null;

    this._tripPointAddButtonElement.disabled = false;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, point),
    );
    this.destroy();
  }

  _handleButtonDeleteClick() {
    this.destroy();
  }

  _handleButtonCloseClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}

