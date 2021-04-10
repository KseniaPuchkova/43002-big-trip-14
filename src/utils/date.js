import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const formatTime = (date) => {
  return dayjs(date).format('HH:mm');
};

const formatUTCDate = (date) => {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
};

const formatFullDate = (date) => {
  return dayjs(date).format('DD[D]/MM[M]/YY[Y] HH:mm');
};

const formatValueDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};

const formatYearMonthDay = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

const formatEditYearMonthDay = (date) => {
  return dayjs(date).format('DD/MM/YY');
};

const formatMonthDay = (date) => {
  return dayjs(date).format('MMM DD');
};

const formatDiffDate = (start, end) => {
  const diffDate = dayjs.duration((dayjs(end).diff(dayjs(start))));

  const days = diffDate.days() === 0 ? '' : diffDate.days() + 'D ';
  const hours = diffDate.hours() === 0 ? '' : diffDate.hours() + 'H ';
  const minutes = diffDate.minutes() === 0 ? '' : diffDate.minutes() + 'M';

  return `${days} ${hours} ${minutes}`;

};

export {formatUTCDate, formatFullDate, formatYearMonthDay, formatMonthDay, formatEditYearMonthDay, formatTime, formatValueDate, formatDiffDate};
