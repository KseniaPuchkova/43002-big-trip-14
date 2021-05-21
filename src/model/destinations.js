import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  set(updateType, destinations) {
    this._destinations = destinations;
    this._notify(updateType);
  }

  get() {
    return this._destinations;
  }

  static adaptToClient(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        photos: destination.pictures,
      },
    );

    delete adaptedDestination.pictures;

    return adaptedDestination;
  }
}
