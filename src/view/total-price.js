import AbstractView from './abstract.js';

export const createTotalPriceTemplate = (totalPrice) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class TotalPrice extends AbstractView {
  constructor(totalPrice) {
    super();
    this._totalPrice = totalPrice;
  }

  getTemplate() {
    return createTotalPriceTemplate(this._totalPrice);
  }
}
