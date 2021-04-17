import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatTime = (date) => {
  return dayjs(date).format('HH:mm');
};

export const formatUTCDate = (date) => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
};

export const formatFullDate = (date) => {
  return dayjs(date).format('DD[D]/MM[M]/YY[Y] HH:mm');
};

export const formatValueDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};

export const formatYearMonthDay = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatEditYearMonthDay = (date) => {
  return dayjs(date).format('DD/MM/YY');
};

export const formatMonthDay = (date) => {
  return dayjs(date).format('MMM DD');
};

export const formatDiffDate = (start, end) => {
  const diffDate = dayjs.duration((dayjs(end).diff(dayjs(start))));

  const days = diffDate.days() === 0 ? '' : diffDate.days() + 'D ';
  const hours = diffDate.hours() === 0 ? '' : diffDate.hours() + 'H ';
  const minutes = diffDate.minutes() === 0 ? '' : diffDate.minutes() + 'M';

  return `${days} ${hours} ${minutes}`;

};
