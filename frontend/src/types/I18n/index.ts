export interface Translations {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string;
    };
  };
}

export interface I18nContextShape {
  translations: Translations;
}
