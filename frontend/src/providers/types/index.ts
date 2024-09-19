import { Params } from '@/types/next';
import { AccountResult } from '@/types/lib/account';
import { Associate, BusinessUnit } from '@shared/types/business-unit';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { ProjectSettings } from '@shared/types/ProjectSettings';
import { I18nProviderProps } from '../I18n/types';

export interface ProvidersProps extends I18nProviderProps, Pick<Params, 'locale'> {
  initialData: {
    account?: AccountResult;
    associate?: Associate;
    businessUnits?: BusinessUnit[];
    projectSettings?: ProjectSettings;
  };
  page: SDKResponse<PageResponse>;
}
