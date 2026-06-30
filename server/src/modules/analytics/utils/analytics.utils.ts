import { TimeRange } from '../dto/request/analytics-query.dto';

export function getDateRange(range?: TimeRange, startDate?: string, endDate?: string): { start: Date; end: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let end = new Date(today);
  end.setHours(23, 59, 59, 999);

  let start = new Date(today);

  switch (range ?? TimeRange.THIS_MONTH) {
    case TimeRange.TODAY:
      start = today;
      break;
    case TimeRange.YESTERDAY:
      start = new Date(today);
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case TimeRange.THIS_WEEK:
      start.setDate(today.getDate() - today.getDay());
      break;
    case TimeRange.LAST_WEEK:
      start.setDate(today.getDate() - today.getDay() - 7);
      end.setDate(today.getDate() - today.getDay() - 1);
      break;
    case TimeRange.THIS_MONTH:
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case TimeRange.LAST_MONTH:
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case TimeRange.THIS_QUARTER:
      const quarter = Math.floor(today.getMonth() / 3);
      start = new Date(today.getFullYear(), quarter * 3, 1);
      break;
    case TimeRange.THIS_YEAR:
      start = new Date(today.getFullYear(), 0, 1);
      break;
    case TimeRange.CUSTOM:
      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      }
      break;
  }

  return { start, end };
}

export function getWeekNumber(date: Date): number {
  const d = new Date(date);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + 1) / 7);
}

export function getPeriodLabel(range: TimeRange | undefined, start: Date, end: Date): string {
  const effectiveRange = range ?? TimeRange.THIS_MONTH;
  if (effectiveRange === TimeRange.CUSTOM) {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
  const labels: Record<TimeRange, string> = {
    [TimeRange.TODAY]: 'Today',
    [TimeRange.YESTERDAY]: 'Yesterday',
    [TimeRange.THIS_WEEK]: 'This Week',
    [TimeRange.LAST_WEEK]: 'Last Week',
    [TimeRange.THIS_MONTH]: 'This Month',
    [TimeRange.LAST_MONTH]: 'Last Month',
    [TimeRange.THIS_QUARTER]: 'This Quarter',
    [TimeRange.THIS_YEAR]: 'This Year',
    [TimeRange.CUSTOM]: 'Custom Range',
  };
  return labels[effectiveRange];
}
