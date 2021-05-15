import EditPointView  from '../view/edit-point.js';
import {BLANK_POINT, UserAction, UpdateType} from '../utils/const.js';
import {RenderPosition, render, remove} from '../utils/render.js';

export default class PointNew {
  constructor(pointContainer, tripPointButtonAddElement, noPointsComponent, changeData, destinationsModel, offersModel) {
    this._pointContainer = pointContainer;
    this._tripPointButtonAddElement = tripPointButtonAddElement;
    this._noPointsComponent = noPointsComponent;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._editPointComponent = null;

    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._renderPointNew();
  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    remove(this._editPointComponent);
    this._editPointComponent = null;

    this._tripPointButtonAddElement.disabled = false;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _renderPointNew() {
    if (this._editPointComponent !== null) {
      return;
    }

    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
      this._noPointsComponent = null;
    }

    this._point = BLANK_POINT;
    BLANK_POINT.offers = this._offersModel.getOffersByType(BLANK_POINT.type);
    this._destinations = this._destinationsModel.getDestinations();
    this._offers = this._offersModel.getOffers();

    this._editPointComponent = new EditPointView(this._point, this._destinations, this._offers);
    this._editPointComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);

    this._tripPointButtonAddElement.disabled = true;

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      Object.assign({},point),
    );
    this.destroy();
  }

  _handleButtonDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}

