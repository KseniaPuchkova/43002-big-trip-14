import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedOffers = [];

    for (let i = 0; i < point.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},
        point.offers[i],
        {
          isChecked: point.offers[i].isChecked,
        },
      ));
    }

    const adaptedPoint = Object.assign({},
      point,
      {
        start: new Date(point.date_from),
        end: new Date(point.date_to),
        price: point.base_price,
        isFavorite: point.is_favorite,
        destination: Object.assign(
          {},
          point.destination,
          {
            photos: point.destination.pictures,
          },
        ),
        offers: adaptedOffers,
      });

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.destination.pictures;
    delete adaptedPoint.offers.isChecked;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedOffers = [];

    for (let i = 0; i < point.offers.length; i++) {
      adaptedOffers.push(Object.assign(
        {},
        point.offers[i],
        {
          isChecked: point.offers[i].isChecked,
        },
      ));
    }

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.start.toISOString(),
        'date_to': point.end.toISOString(),
        'base_price': point.price,
        'is_favorite': point.isFavorite,
        destination: Object.assign(
          {},
          point.destination,
          {
            pictures: point.destination.photos,
          },
        ),
        offers: adaptedOffers,
      },
    );

    delete adaptedPoint.start;
    delete adaptedPoint.end;
    delete adaptedPoint.price;
    delete adaptedPoint.photos;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.offers.isChecked;

    return adaptedPoint;
  }
}
