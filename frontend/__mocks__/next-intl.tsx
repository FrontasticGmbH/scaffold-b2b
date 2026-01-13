import React from 'react';
// @ts-ignore - JSON import
import messages from '../src/messages/en.json';

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Helper to get nested value from object by dot notation key
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path;
};

// Helper to replace ICU message placeholders like {from}, {to}, etc.
const replacePlaceholders = (message: string, values?: Record<string, any>): string => {
  if (!values) return message;

  return Object.keys(values).reduce((result, key) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(values[key]));
  }, message);
};

export const useTranslations = () => (key: string, values?: Record<string, any>) => {
  const message = getNestedValue(messages, key);
  return replacePlaceholders(message, values);
};

export const useLocale = () => 'en-us';

export const useFormatter = () => ({
  dateTime: (date: Date) => date.toISOString(),
  number: (num: number) => num.toString(),
  relativeTime: (date: Date) => date.toISOString(),
});

export const useMessages = () => messages;

export const useNow = () => new Date();

export const useTimeZone = () => 'UTC';

// Mock next-intl/navigation exports
export const createNavigation = () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  redirect: (href: string) => href,
  usePathname: () => '/en-us',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
});

// Mock next-intl/routing exports
export const defineRouting = (config: any) => config;
