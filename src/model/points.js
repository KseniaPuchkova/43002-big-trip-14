import Observer from '../utils/observer.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  set(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  get() {
    return this._points;
  }

  update(updateType, update) {
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

  add(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
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
      });

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.destination.pictures;
    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.start.toISOString(),
        'date_to': point.end.toISOString(),
        'base_price': point.price ? point.price : null,
        'is_favorite': point.isFavorite ? point.isFavorite : false,
        destination: Object.assign(
          {},
          point.destination,
          {
            pictures: point.destination.photos,
          },
        ),
      },
    );

    delete adaptedPoint.start;
    delete adaptedPoint.end;
    delete adaptedPoint.price;
    delete adaptedPoint.destination.photos;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.isNew;

    return adaptedPoint;
  }
}
