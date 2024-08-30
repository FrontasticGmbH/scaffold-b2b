export const constructLocalizedUrl = (href: string, locale: string) => {
  if (href.startsWith('http') || href.startsWith('?') || href.startsWith('#') || !href.startsWith('/')) return href;

  return `/${locale}${href}`;
};
