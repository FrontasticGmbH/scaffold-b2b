import { LinkReference, PageFolderReference } from '@/types/lib/reference';
import { resolveReference } from './resolve-reference';

describe('resolveReference', () => {
  it('should resolve link when the reference type is a link', () => {
    const reference = {
      type: 'link',
      link: '/some_link',
    } as LinkReference;

    const value = resolveReference(reference);
    expect(value).toEqual({ href: '/some_link', openInNewTab: undefined, name: undefined });
  });

  it('should resolve link when the reference type is page-folder', () => {
    const reference = {
      type: 'page-folder',
      pageFolder: {
        _url: '/some_url',
      },
      openInNewWindow: true,
    } as PageFolderReference;

    const value = resolveReference(reference, 'test');
    expect(value).toEqual({ href: '/some_url', openInNewTab: true, name: 'test' });
  });
});
