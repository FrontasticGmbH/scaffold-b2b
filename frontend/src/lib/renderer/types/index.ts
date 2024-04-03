import { Params, SearchParams } from '@/types/next';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';

export interface RendererProps {
  data: PageResponse;
  params: Params;
  searchParams: SearchParams;
  gridClassName?: string;
  wrapperClassName?: string;
  currentHighlight?: string;
}
