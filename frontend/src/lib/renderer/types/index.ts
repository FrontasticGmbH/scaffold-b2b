import { TasticRegistry } from '@/lib/tastics/types';
import { Params, SearchParams } from '@/types/next';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';

export interface RendererProps {
  data: PageResponse;
  tastics: TasticRegistry;
  params: Params;
  searchParams: SearchParams;
  gridClassName?: string;
  wrapperClassName?: string;
  currentHighlight?: string;
}
