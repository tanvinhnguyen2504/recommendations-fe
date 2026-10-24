export type Locale = 'vi' | 'en';

const INTL_LOCALE: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US' };

export function formatCount(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}

export function formatVnd(amount: number, locale: Locale): string {
  const digits = new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${digits}₫`;
}

export function formatDecimal(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDistance(metres: number, locale: Locale): string {
  if (metres < 1000) {
    return `${formatCount(Math.round(metres), locale)} m`;
  }

  return `${formatDecimal(metres / 1000, locale)} km`;
}

// The API returns opening hours as a wall-clock 'HH:mm' string with no timezone.
// Building a Date would invent one, so the 12-hour conversion is done by hand.
export function formatTime(time: string, locale: Locale): string {
  const [rawHour, rawMinute] = time.split(':');
  const hour = Number(rawHour);
  const minute = rawMinute ?? '00';

  if (locale === 'vi') {
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }

  const suffix = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12}:${minute} ${suffix}`;
}
