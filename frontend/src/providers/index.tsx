'use client';

import { sdk } from '@/sdk';
import { SWRProvider } from './swr';
import I18nProvider from './I18n';
import { ProvidersProps } from './types';
import ShipAndLanguageProvider from './ship-and-language';

export const Providers = ({
  locale,
  translations,
  accountResult,
  children,
}: React.PropsWithChildren<ProvidersProps>) => {
  sdk.configureForNext(locale);

  return (
    <I18nProvider translations={translations}>
      <SWRProvider value={{ fallback: { '/action/account/getAccount': { data: accountResult } } }}>
        <ShipAndLanguageProvider>{children}</ShipAndLanguageProvider>
      </SWRProvider>
    </I18nProvider>
  );
};
