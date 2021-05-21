import EditPointView  from '../view/edit-point.js';
import PointView  from '../view/point.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {areDatesEqual} from '../utils/date.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
export default class Point {
  constructor(pointContainer, changeData, changeMode, destinationsModel, offersModel) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleButtonOpenClick = this._handleButtonOpenClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    this._destinations = this._destinationsModel.get();
    this._offers = this._offersModel.get();

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point, this._destinations, this._offers);

    this._pointComponent.setButtonOpenClickHandler(this._handleButtonOpenClick);
    this._editPointComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._editPointComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditPointComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editPointComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._editPointComponent.updateState({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._editPointComponent.updateState({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._editPointComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  _replacePointToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleButtonOpenClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replacePointToEdit();
    this._editPointComponent.reset(this._point);
  }

  _handleButtonCloseClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replaceEditToPoint();
  }

  _handleButtonDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point,{
        isFavorite: !this._point.isFavorite,
      }),
    );
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    const isMinorUpdate = !areDatesEqual(this._point.start, update.start) || this._point.price !== update.price || this._point.offers;

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceEditToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }
}
