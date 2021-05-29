import Observer from '../utils/observer';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  set(updateType, offers) {
    this._offers = offers;
    this._notify(updateType);
  }

  get() {
    return this._offers;
  }
}
