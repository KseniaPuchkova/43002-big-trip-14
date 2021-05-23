import {SHOW_TIME} from '../utils/const.js';

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.prepend(toastContainer);

export const toastMessage = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export const errorMessage = (parent, message) => {
  const errorItem = document.createElement('div');
  errorItem.textContent = message;
  errorItem.classList.add('error-item');

  parent.style.position = 'relative';
  parent.appendChild(errorItem);

  setTimeout(() => {
    errorItem.remove();
  }, SHOW_TIME);
};
