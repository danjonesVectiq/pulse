
import { DateRange } from '../types';

// Parses YYYY-MM-DD string to Date object (UTC to avoid timezone issues)
export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

// Formats Date object to YYYY-MM-DD string
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];
  let currentDate = new Date(startDate.getTime()); // Use UTC time
  currentDate.setUTCHours(0,0,0,0);


  const finalEndDate = new Date(endDate.getTime());
  finalEndDate.setUTCHours(0,0,0,0);


  while (currentDate <= finalEndDate) {
    days.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return days;
};

export const getMonthDateRange = (year: number, month: number): DateRange => {
    // month is 0-indexed for Date constructor (0 for January, 11 for December)
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0)); // Day 0 of next month is last day of current month
    return { start, end };
};

export const getTodayDateString = (): string => {
  return formatDateToString(new Date());
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subDays = (date: Date, days: number): Date => {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() - days);
  return result;
};

export const formatDateForDisplay = (dateStr: string): string => {
  return parseDateString(dateStr).toLocaleDateString('en-AU');
};
    