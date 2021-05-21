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

  getByType(type) {
    return this._offers.find((offer) => offer.type === type).offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = [];

    for (let i = 0; i < offers.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},
        offers.offers[i],
        {
          isChecked: offers.offers[i].isChecked,
        },
      ));
    }

    return {
      type: offers.type,
      offers: adaptedOffers,
    };
  }
}
