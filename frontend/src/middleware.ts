import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { i18n, Locale, LocaleCode } from './project.config';

export function middleware(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  const search = request.nextUrl.searchParams.toString();

  const path = request.nextUrl.pathname + (search ? `?${search}` : '');

  const pathMissingLocale = i18n.locales.every((locale) => !path.startsWith(`/${locale}/`));

  let locale: Locale;
  let response: NextResponse;

  if (pathMissingLocale) {
    const storedLocale = request.cookies.get('locale')?.value as Locale | undefined;
    const preferredLocale = new Negotiator({ headers }).language(i18n.locales) as Locale | undefined;

    locale = [storedLocale, preferredLocale, i18n.defaultLocale].find(
      (l): l is Locale => l !== undefined && i18n.locales.includes(l),
    ) as Locale;

    response = NextResponse.redirect(new URL(`/${locale}${path}`, request.url));
  } else {
    locale = path.split('/')[1];
    const containsMultipleLocaleOccurrences = new RegExp(`^/${locale}/.*(/${locale}/)`, 'g').test(path);
    if (containsMultipleLocaleOccurrences) {
      const correctedPath = path.replace(new RegExp(`^/${locale}/.*(/${locale}/)`), `/${locale}/`);
      response = NextResponse.redirect(new URL(correctedPath, request.url));
    } else {
      response = NextResponse.next();
    }
  }

  response.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 7 * 4 * 12 * 100 }); // 100 years expiry

  if (
    process.env.BUILD_CONTEXT === 'deploy-preview' &&
    process.env.FRONTASTIC_TESTING_SESSION &&
    request.nextUrl.pathname !== `/${locale}/login/` &&
    !request.cookies.get('frontastic-session')?.value
  ) {
    response.cookies.set('frontastic-session', process.env.FRONTASTIC_TESTING_SESSION);
  }

  return response;
}

export const config = {
  matcher: '/((?!api|_next|favicon|manifest|locales|storybook|images|sb-assets|template\\.csv).*)',
};
