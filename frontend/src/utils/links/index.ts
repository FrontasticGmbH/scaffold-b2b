import { Locale } from '@/project.config';

export const constructLocalizedUrl = (href: string, locale: Locale) => {
  if (href.startsWith('http') || href.startsWith('?') || href.startsWith('#') || !href.startsWith('/')) return href;

  return `/${locale}${href}`;
};
