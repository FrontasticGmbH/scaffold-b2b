import { Params, SearchParams } from '@/types/next';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Category } from '@shared/types/product';
import { ProjectSettings } from '@shared/types/ProjectSettings';

export interface RendererProps {
  data: PageResponse;
  params: Params;
  searchParams: SearchParams;
  gridClassName?: string;
  wrapperClassName?: string;
  currentHighlight?: string;
  projectSettings?: ProjectSettings;
  flatCategories?: Category[];
  treeCategories?: Category[];
}
