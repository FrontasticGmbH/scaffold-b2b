import { Reference } from '@/types/lib/reference';
import { Link } from '@/types/link';

export const resolveReference = (reference?: Reference, name?: string): Link => {
  let href = '/';

  if (reference?.type === 'link' && reference.link) href = reference.link;

  if (reference?.type === 'page-folder' && reference.pageFolder?._url) href = reference.pageFolder._url;

  return { href, name, openInNewTab: reference?.openInNewWindow };
};
