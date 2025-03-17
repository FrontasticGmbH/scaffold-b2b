import { Params } from '@/types/next';
import { AccountResult } from '@/types/lib/account';
import { Associate, BusinessUnit } from '@shared/types/business-unit';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { ProjectSettings } from '@shared/types/ProjectSettings';
import { Category } from '@shared/types/product';
import { PaginatedResult } from '@shared/types/result';

export interface ProvidersProps extends Pick<Params, 'locale'> {
  initialData: {
    account?: AccountResult;
    associate?: Associate;
    businessUnits?: BusinessUnit[];
    projectSettings?: ProjectSettings;
    flatCategories?: PaginatedResult<Category>;
    treeCategories?: PaginatedResult<Category>;
  };
  page: SDKResponse<PageResponse>;
}
