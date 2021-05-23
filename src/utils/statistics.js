import dayjs from 'dayjs';

export const getTypesUnique = (points) => Array.from(new Set(points.slice().map((point) => point.type.toUpperCase())));

export const getMoneySpend = (points, types) => types.map((type) => {
  const moneySpend = points.filter((point) => point.type === type.toLowerCase()).reduce((acc, point) => acc + point.price, 0);

  return {
    moneySpend,
    type,
  };

}).sort((a, b) => b.moneySpend - a.moneySpend);

export const getTypesCount = (points, types) => types.map((type) => {
  const typesCount = points.filter((point) => point.type === type.toLowerCase()).length;

  return {
    typesCount,
    type,
  };

}).sort((a, b) => b.typesCount - a.typesCount);

export const getTimeSpend = (points, types) => types.map((type) => {
  let duration = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      const start = dayjs(point.start);
      const end = dayjs(point.end);
      const diffDate = end.diff(start);
      duration += diffDate;
    }
  });

  const timeSpend = parseInt(dayjs.duration(duration).asMilliseconds(), 10);

  return {
    timeSpend,
    type,
  };

}).sort((a, b) => b.timeSpend - a.timeSpend);

