import { Params } from '@/types/next';
import { AccountResult } from '@/types/lib/account';
import { BusinessUnit } from '@shared/types/business-unit';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { I18nProviderProps } from '../I18n/types';

export interface ProvidersProps extends I18nProviderProps, Pick<Params, 'locale'> {
  initialData: {
    account?: AccountResult;
    businessUnits?: BusinessUnit[];
  };
  tracing: SDKResponse<unknown>['tracing'];
}
