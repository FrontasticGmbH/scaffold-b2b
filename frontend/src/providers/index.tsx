'use client';

import { sdk } from '@/sdk';
import { SWRProvider } from './swr';
import I18nProvider from './I18n';
import { ProvidersProps } from './types';
import ShipAndLanguageProvider from './ship-and-language';
import StoreAndBusinessUnitsProvider from './store-and-business-units';

export const Providers = ({
  locale,
  translations,
  accountResult,
  children,
}: React.PropsWithChildren<ProvidersProps>) => {
  sdk.defaultConfigure(locale);

  return (
    <I18nProvider translations={translations}>
      <SWRProvider value={{ fallback: { '/action/account/getAccount': { data: accountResult } } }}>
        <ShipAndLanguageProvider>
          <StoreAndBusinessUnitsProvider>{children} </StoreAndBusinessUnitsProvider>
        </ShipAndLanguageProvider>
      </SWRProvider>
    </I18nProvider>
  );
};
