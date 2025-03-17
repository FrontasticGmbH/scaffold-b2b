'use client';

import { sdk } from '@/sdk';
import AddToCartOverlayProvider from '@/providers/add-to-cart-overlay';
import { SWRProvider } from './swr';
import { ProvidersProps } from './types';
import ShipAndLanguageProvider from './ship-and-language';
import StoreAndBusinessUnitsProvider from './store-and-business-units';
import TracingProvider from './tracing';

export const Providers = ({ locale, initialData, page, children }: React.PropsWithChildren<ProvidersProps>) => {
  sdk.defaultConfigure(locale);

  return (
    <TracingProvider page={page}>
      <SWRProvider
        value={{
          fallback: {
            '/action/account/getAccount': { data: initialData.account },
            '/action/business-unit/getBusinessUnits': { data: initialData.businessUnits },
            '/action/business-unit/getAssociate': { data: initialData.associate },
            '/action/project/getProjectSettings': { data: initialData.projectSettings },
            '/action/product/queryCategories?format=flat': { data: initialData.flatCategories },
            '/action/product/queryCategories?format=tree': { data: initialData.treeCategories },
          },
        }}
      >
        <ShipAndLanguageProvider projectSettings={initialData.projectSettings}>
          <StoreAndBusinessUnitsProvider>
            <AddToCartOverlayProvider>{children}</AddToCartOverlayProvider>
          </StoreAndBusinessUnitsProvider>
        </ShipAndLanguageProvider>
      </SWRProvider>
    </TracingProvider>
  );
};
