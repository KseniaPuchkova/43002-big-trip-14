import AbstractView from './abstract.js';

export const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs" disabled>
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
   </nav>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuItem(menuItem) {
    const buttonsMenu = this.getElement().querySelectorAll('.trip-tabs__btn');

    buttonsMenu.forEach((buttonMenu) => {
      if (buttonMenu.textContent.toUpperCase() === menuItem) {
        buttonMenu.classList.add('trip-tabs__btn--active');
      } else {
        buttonMenu.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  showMenu() {
    this.getElement().classList.remove('visually-hidden');
  }

  hideMenu() {
    this.getElement().classList.add('visually-hidden');
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A' || evt.target.classList.contains('trip-tabs__btn--active')) {
      return;
    }

    this._callback.menuClick(evt.target.textContent.toUpperCase());
  }
}
