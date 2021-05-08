import Observer from '../utils/observer';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType (type) {
    return this._offers[type];
  }

  getOffersTypes() {
    return Object.keys(this._offers);
  }
}
