import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  currency: Currency;
  currencyCode: string;
  countryCode: string;
  countryName: string;
}

const localizationMapper = {
  'en-us': {
    locale: 'en_US',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
    countryName: 'United States',
  },
  'en-gb': {
    locale: 'en_GB',
    currency: 'GBP',
    currencyCode: '£',
    countryCode: 'GB',
    countryName: 'United Kingdom',
  },
  'en-au': {
    locale: 'en_AU',
    currency: 'AUD',
    currencyCode: 'A$',
    countryCode: 'AU',
    countryName: 'Australia',
  },
  'en-nz': {
    locale: 'en_NZ',
    currency: 'NZD',
    currencyCode: 'NZ$',
    countryCode: 'NZ',
    countryName: 'New Zealand',
  },
  'de-de': {
    locale: 'de_DE',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'DE',
    countryName: 'Germany',
  },
  'fr-fr': {
    locale: 'fr_FR',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'FR',
    countryName: 'France',
  },
  'es-es': {
    locale: 'es_ES',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'ES',
    countryName: 'Spain',
  },
  'pt-pt': {
    locale: 'pt_PT',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'PT',
    countryName: 'Portugal',
  },
  'nl-nl': {
    locale: 'nl_NL',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'NL',
    countryName: 'Netherlands',
  },
  'it-it': {
    locale: 'it_IT',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'IT',
    countryName: 'Italy',
  },
} as Record<string, LocalizationMapping>;

const locales = Object.keys(localizationMapper);
const defaultLocale = locales[0];
const countries = Object.values(localizationMapper).map(({ countryCode, countryName }) => ({
  countryCode,
  countryName,
}));

export const i18nConfig = { locales, defaultLocale, countries };

export const getLocalizationInfo = (locale: string) => {
  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale} provided. Possible values are ${Object.keys(localizationMapper).join(', ')}`,
    );

    return localizationMapper[defaultLocale];
  }

  return localizationMapper[locale as keyof typeof localizationMapper];
};
