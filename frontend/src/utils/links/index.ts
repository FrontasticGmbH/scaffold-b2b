export const constructLocalizedUrl = (href: string, locale: string) => {
  if (href.startsWith('http') || href.startsWith('?') || href.startsWith('#')) return href;

  if (href.startsWith('/')) return `/${locale}${href}`;

  return `/${locale}/${href}`;
};
