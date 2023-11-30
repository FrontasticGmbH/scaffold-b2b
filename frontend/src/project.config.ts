import { Currency } from '@commercetools/frontend-sdk/lib/types/Currency';

interface LocalizationMapping {
  locale: string;
  currency: Currency;
  currencyCode: string;
  countryCode: string;
  countryKey: string;
}

const localizationMapper = {
  en: {
    locale: 'en_US',
    currency: 'USD',
    currencyCode: '$',
    countryCode: 'US',
    countryKey: 'us',
  },
  sv: {
    locale: 'sv_SE',
    currency: 'SEK',
    currencyCode: 'kr',
    countryCode: 'SE',
    countryKey: 'sweden',
  },
} as Record<string, LocalizationMapping>;

export const getLocalizationInfo = (locale: string) => {
  if (!(locale in localizationMapper)) {
    console.warn(
      `Invalid locale ${locale} provided. Possible values are ${Object.keys(localizationMapper).join(', ')}`,
    );

    return localizationMapper.en;
  }

  return localizationMapper[locale as keyof typeof localizationMapper];
};
