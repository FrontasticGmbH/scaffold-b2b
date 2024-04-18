import { Translations } from '@/types/I18n';
import { fetchFromHost } from '@/utils/server/fetch-from-host';

export const getTranslations = async (locales: string[], namespaces: string[]) => {
  const translations = {} as Translations;

  await Promise.all(
    locales.map(async (locale) => {
      translations[locale] = {};

      return await Promise.all(
        namespaces.map(async (namespace) => {
          const data = await fetchFromHost(`/locales/${locale}/${namespace}.json`).then((res) => res.json());

          translations[locale][namespace] = data;
        }),
      );
    }),
  );

  return translations;
};
