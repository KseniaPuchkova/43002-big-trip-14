import dayjs from 'dayjs';

export const BAR_HEIGHT = 55;

export const getTypesUnique = (points) => [...new Set(points.map((point) => point.type.toUpperCase()))];

export const getSpentMoney = (points, types) => types.map((type) => {
  return points.filter((point) => point.type === type.toLowerCase())
    .reduce((acc, point) => acc + point.price, 0);
});

export const getCountTypes = (points, types) => types.map((type) => {
  return points.filter((point) => point.type === type.toLowerCase()).length;
});

export const getSpentTime = (points, types) => types.map((type) => {
  let spendTime = 0;

  points.forEach((point) => {
    if (point.type === type.toLowerCase()) {
      const start = dayjs(point.start);
      const end = dayjs(point.end);
      const diffDate = end.diff(start);
      spendTime += diffDate;
    }
  });

  return parseInt(dayjs.duration(spendTime).asMilliseconds(), 10);
});
