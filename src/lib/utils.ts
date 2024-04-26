import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, sub } from 'date-fns';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const chatHrefConstructor = (id1: string, id2: string) => {
  const sortedIds = [id1, id2].sort();

  return `${sortedIds[0]}--${sortedIds[1]}`;
};

export const formatMessageTimestamp = (timestamp: number) => {
  if (format(timestamp, 'dd/MM') === format(Date.now(), 'dd/MM'))
    return `Hoje ${format(timestamp, 'HH:mm')}`;

  if (format(timestamp, 'dd/MM') === format(sub(Date.now(), { days: 1 }), 'dd/MM'))
    return `Ontem ${format(timestamp, 'HH:mm')}`;

  return format(timestamp, 'dd/MM HH:mm');
};
