import dayjsBase from 'dayjs';
var duration = require('dayjs/plugin/duration');

dayjsBase.extend(duration);

export const dayjs = dayjsBase;

export const getTimeEnd = (startTime: string, duration: number): string => {
  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes = startMinutes + Math.floor(duration / 60000);

  const minutes = (endMinutes % 60).toString().padStart(2, '0');
  const hours = Math.floor(endMinutes / 60) % 24;
  const resultTime = `${hours.toString().padStart(2, '0')}:${minutes}`;

  return resultTime;
};
