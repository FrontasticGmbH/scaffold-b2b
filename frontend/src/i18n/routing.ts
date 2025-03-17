import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { i18nConfig } from '../project.config';

export const routing = defineRouting({
  locales: i18nConfig.locales,
  defaultLocale: i18nConfig.defaultLocale,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
