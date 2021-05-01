import EditPointView  from '../view/edit-point.js';
import PointView  from '../view/point.js';
import {RenderPosition, render, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleButtonOpenClick = this._handleButtonOpenClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point);

    this._pointComponent.setButtonOpenClickHandler(this._handleButtonOpenClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointComponent.setButtonCloseClickHandler(this._handleButtonCloseClick);
    this._editPointComponent.setSubmitHandler(this._handleSubmit);

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

  _handleSubmit(point) {
    this._changeData(point);
    this._replaceEditToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign({},this._point,{
        isFavorite: !this._point.isFavorite,
      }),
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceEditToPoint();
      document.removeEventListener('keydown', this._onEscKeyDown);
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
