import { Page as BasePage, PageFolder, Section } from '@frontastic/extension-types';
import { PageViewData } from '@commercetools/frontend-sdk/lib/types/api/page';

interface Page extends BasePage {
  sections: Record<string, Section>;
}

declare module '@commercetools/frontend-sdk/lib/types/api/page/PageResponse' {
  interface PageResponse {
    page: Page;
    pageFolder: PageFolder;
    data: PageViewData;
  }
}
