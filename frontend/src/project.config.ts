import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  name: string;
  locale: string;
  currency: Currency;
  countries: string[];
}

const localizationMapper = {
  'en-us': {
    name: 'English - US',
    locale: 'en-US',
    currency: 'USD',
    countries: ['US'],
  },
  'en-gb': {
    name: 'English - GB',
    locale: 'en-GB',
    currency: 'GBP',
    countries: ['GB'],
  },
  'en-au': {
    name: 'English - AU',
    locale: 'en-AU',
    currency: 'AUD',
    countries: ['AU'],
  },
  'en-nz': {
    name: 'English - NZ',
    locale: 'en-NZ',
    currency: 'NZD',
    countries: ['NZ'],
  },
  'de-de': {
    name: 'German - DE',
    locale: 'de-DE',
    currency: 'EUR',
    countries: ['DE'],
  },
  'fr-fr': {
    name: 'French - FR',
    locale: 'fr-FR',
    currency: 'EUR',
    countries: ['FR'],
  },
  'es-es': {
    name: 'Spanish - ES',
    locale: 'es-ES',
    currency: 'EUR',
    countries: ['ES'],
  },
  'pt-pt': {
    name: 'Portuguese - PT',
    locale: 'pt-PT',
    currency: 'EUR',
    countries: ['PT'],
  },
  'nl-nl': {
    name: 'Dutch - NL',
    locale: 'nl-NL',
    currency: 'EUR',
    countries: ['NL'],
  },
  'it-it': {
    name: 'Italian - IT',
    locale: 'it-IT',
    currency: 'EUR',
    countries: ['IT'],
  },
} satisfies Record<string, LocalizationMapping>;

export type Locale = keyof typeof localizationMapper;

const locales = Object.keys(localizationMapper) as Locale[];
const defaultLocale = locales[0] as Locale;

export const i18nConfig = {
  locales: locales,
  defaultLocale: locales[0],
};

export const getLocalizationInfo = (locale: string) => {
  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale} provided. Possible values are ${Object.keys(localizationMapper).join(', ')}`,
    );

    return localizationMapper[defaultLocale];
  }

  return localizationMapper[locale as keyof typeof localizationMapper];
};
