import EditPointView  from '../view/edit-point.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {BLANK_POINT} from '../utils/point.js';
import {RenderPosition, render, remove} from '../utils/render.js';

export default class PointNew {
  constructor(pointContainer, buttonNewComponent, changeData, destinationsModel, offersModel) {
    this._pointContainer = pointContainer;
    this._buttonNewComponent = buttonNewComponent;
    this._changeData = changeData;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._editPointComponent = null;

    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._editPointComponent !== null) {
      return;
    }

    this._point = BLANK_POINT;
    BLANK_POINT.offers = this._offersModel.getOffersByType(BLANK_POINT.type);
    this._destinations = this._destinationsModel.getDestinations();
    this._offers = this._offersModel.getOffers();

    this._editPointComponent = new EditPointView(this._point, this._destinations, this._offers);
    this._editPointComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._pointContainer, this._editPointComponent, RenderPosition.AFTERBEGIN);

    this._buttonNewComponent.disabled = true;

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._editPointComponent === null) {
      return;
    }

    remove(this._editPointComponent);
    this._editPointComponent = null;

    this._buttonNewComponent.disabled = false;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._editPointComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._editPointComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._editPointComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this._buttonNewComponent.disabled = false;
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

