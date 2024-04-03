import { Params } from '@/types/next';
import { AccountResult } from '@/types/lib/account';
import { BusinessUnit } from '@shared/types/business-unit';
import { I18nProviderProps } from '../I18n/types';

export interface ProvidersProps extends I18nProviderProps, Pick<Params, 'locale'> {
  initialData: {
    account?: AccountResult;
    businessUnits?: BusinessUnit[];
  };
}
