import EditPointView  from '../view/edit-point.js';
import PointView  from '../view/point.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {areDatesEqual} from '../utils/date.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
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
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    this._destinationsNames = this._destinationsModel.getDestinationsNames();
    this._offersTypes = this._offersModel.getOffersTypes();
    this._currentType = this._point.type;
    this._currentDestinationName = this._point.destination.name;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point, this._offersTypes);
    this._editPointComponent = new EditPointView(point, this._destinationsNames, this._offersTypes);

    this._pointComponent.setButtonOpenClickHandler(this._handleButtonOpenClick);
    this._editPointComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._editPointComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setDestinationChangeHandler(this._handleDestinationChange);
    this._editPointComponent.setTypeChangeHandler(this._handleTypeChange);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  _renderPointsList() {
    render(this._tripContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleButtonOpenClick() {
    this._replacePointToEdit();
    this._editPointComponent.reset(this._point);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleButtonCloseClick() {
    this._replaceEditToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleButtonDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign({}, this._point,{
        isFavorite: !this._point.isFavorite,
      }),
    );
  }

  _handleDestinationChange(name) {
    if (this._currentDestinationName === name) {
      return;
    }

    this._currentDestinationName = name;
    const destination = this._destinationsModel.getDestinationByName(name);
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point,{
        destination,
      }),
    );
  }

  _handleTypeChange(type) {
    if (this._currentType === type) {
      return;
    }

    this._currentType === type;
    const offers = this._offersModel.getOffersByType(type);
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign({}, this._point,{
        type,
        offers,
      }),
    );
  }

  _handleFormSubmit(point) {
    const isMinorUpdate = !areDatesEqual(this._point.start, point.start) || this._point.price !== point.price || this._point.offers;

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
    this._replaceEditToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceEditToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
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
}
