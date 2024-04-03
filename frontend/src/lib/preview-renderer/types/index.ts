import { Params, SearchParams } from '@/types/next';
import { PagePreviewResponse } from '@commercetools/frontend-sdk/lib/types/api/page';

export interface PreviewRendererProps {
  data: PagePreviewResponse & { previewContext?: { customerName?: string } };
  params: Params;
  searchParams: SearchParams;
}
