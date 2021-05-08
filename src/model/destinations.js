import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  getDestinationByName(nameToGetBy) {
    return this._destinations[nameToGetBy];
  }

  getDestinationsNames() {
    if (this._destinations) {
      return Object.keys(this._destinations);
    }
  }
}
