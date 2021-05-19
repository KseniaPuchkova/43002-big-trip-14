import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(updateType, destinations) {
    this._destinations = destinations;
    this._notify(updateType);
  }

  getDestinations() {
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

  static adaptToServer(destination) {
    const adaptedDestination = Object.assign(
      {},
      destination,
      {
        pictures: destination.photos,
      },
    );

    delete adaptedDestination.photos;

    return adaptedDestination;
  }
}
