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

  const days = diffDate.days() === 0 ? '' : String(diffDate.days()).padStart(2, '0') + 'D ';
  const hours = (diffDate.hours() === 0 && diffDate.days() === 0) ? '' : String(diffDate.hours()).padStart(2, '0') + 'H ';
  const minutes = String(diffDate.minutes()).padStart(2, '0') + 'M';

  return `${days} ${hours} ${minutes}`;
};

export const formatDuration = (duration) => {
  const daysDuration = dayjs.duration(duration).days();
  const hoursDuration = dayjs.duration(duration).hours();
  const minutesDuration = dayjs.duration(duration).minutes();

  const days = daysDuration === 0 ? '' : String(daysDuration).padStart(2, '0') + 'D ';
  const hours = (hoursDuration === 0 && daysDuration === 0)? '' : String(hoursDuration).padStart(2, '0') + 'H ';
  const minutes = String(minutesDuration).padStart(2, '0') + 'M';

  return `${days} ${hours} ${minutes}`;
};

export const areDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};

export const addDays = (date) => {
  const day = 1;

  return date.setDate(date.getDate() + day);
};
