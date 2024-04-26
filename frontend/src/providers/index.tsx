'use client';

import { sdk } from '@/sdk';
import AddToCartOverlayProvider from '@/providers/add-to-cart-overlay';
import { SWRProvider } from './swr';
import I18nProvider from './I18n';
import { ProvidersProps } from './types';
import ShipAndLanguageProvider from './ship-and-language';
import StoreAndBusinessUnitsProvider from './store-and-business-units';
import TracingProvider from './tracing';

export const Providers = ({
  locale,
  translations,
  initialData,
  tracing,
  children,
}: React.PropsWithChildren<ProvidersProps>) => {
  sdk.defaultConfigure(locale);

  return (
    <TracingProvider tracing={tracing}>
      <I18nProvider translations={translations}>
        <SWRProvider
          value={{
            fallback: {
              '/action/account/getAccount': { data: initialData.account },
              '/action/business-unit/getBusinessUnits': { data: initialData.businessUnits },
            },
          }}
        >
          <ShipAndLanguageProvider>
            <StoreAndBusinessUnitsProvider>
              <AddToCartOverlayProvider>{children}</AddToCartOverlayProvider>
            </StoreAndBusinessUnitsProvider>
          </ShipAndLanguageProvider>
        </SWRProvider>
      </I18nProvider>
    </TracingProvider>
  );
};
