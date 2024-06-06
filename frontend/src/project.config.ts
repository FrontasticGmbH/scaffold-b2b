import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  currency: Currency;
  currencyCode: string;
  countryCode: string;
}

const localizationMapper = {
  'en-us': {
    locale: 'en_US',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
  },
  'en-gb': {
    locale: 'en_GB',
    currency: 'GBP',
    currencyCode: '£',
    countryCode: 'GB',
  },
  'en-au': {
    locale: 'en_AU',
    currency: 'AUD',
    currencyCode: 'A$',
    countryCode: 'AU',
  },
  'en-nz': {
    locale: 'en_NZ',
    currency: 'NZD',
    currencyCode: 'NZ$',
    countryCode: 'NZ',
  },
  'de-de': {
    locale: 'de_DE',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'DE',
  },
  'fr-fr': {
    locale: 'fr_FR',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'FR',
  },
  'es-es': {
    locale: 'es_ES',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'ES',
  },
  'pt-pt': {
    locale: 'pt_PT',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'PT',
  },
  'nl-nl': {
    locale: 'nl_NL',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'NL',
  },
  'it-it': {
    locale: 'it_IT',
    currency: 'EUR',
    currencyCode: '€',
    countryCode: 'IT',
  },
} as Record<string, LocalizationMapping>;

const locales = Object.keys(localizationMapper);
const defaultLocale = locales[0];

export const i18nConfig = { locales, defaultLocale };

export const getLocalizationInfo = (locale: string) => {
  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale} provided. Possible values are ${Object.keys(localizationMapper).join(', ')}`,
    );

    return localizationMapper[defaultLocale];
  }

  return localizationMapper[locale as keyof typeof localizationMapper];
};
