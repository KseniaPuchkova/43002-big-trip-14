const createSortTypeMarkup = (sortType, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isChecked ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-event" data-sort-type="${sortType}">${sortType}</label>
      </div>`
  );
};

export const createSortingTemplate = (sortTypes) => {
  const sortTypesList = sortTypes.map((sortType, i) => createSortTypeMarkup(sortType, i === 0)).join('\n');
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
        ${sortTypesList}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
     </form>`
  );
};

