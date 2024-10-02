import { Country } from '@/types/entity/country';
import { ProjectSettings } from '@shared/types/ProjectSettings';
import countries from '@/static/countries.json';
import { getLocalizationInfo, i18nConfig } from '@/project.config';

export const mapCountry = (country: Required<ProjectSettings>['countries'][0]): Country => {
  const matchedCountry = countries.find((c) => c.code.toLowerCase() === country.toLowerCase());

  const matchedLocales = i18nConfig.locales.filter((locale) =>
    getLocalizationInfo(locale).countries.find((c) => c.toLowerCase() === country.toLowerCase()),
  );

  return {
    name: matchedCountry?.name ?? '',
    code: matchedCountry?.code ?? '',
    states: matchedCountry?.states ?? [],
    locales: matchedLocales.map((locale) => ({
      name: getLocalizationInfo(locale).name,
      locale,
    })),
    currencies: matchedLocales.map((locale) => getLocalizationInfo(locale).currency),
  };
};
