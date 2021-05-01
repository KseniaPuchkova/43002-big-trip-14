import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._stateData = {};
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._stateData = Object.assign(
      {},
      this._stateData,
      update,
    );

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
