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

  getDestinationsMap() {
    return this._destinations.reduce((acc, destination) => (acc[destination.name] = destination, acc), {});
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
