import { PageProps } from '@/types/next';
import { sdk } from '@/sdk';
import { Providers } from '@/providers';
import PreviewRenderer from '@/lib/preview-renderer';
import Toaster from '@/components/atoms/toaster';

export const fetchCache = 'force-no-store';

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale, previewId } = params;

  sdk.defaultConfigure(locale);

  const page = await sdk.page.getPreview({ previewId: previewId as string });

  if (page.isError) return <></>;

  return (
    <div data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}>
      <Providers locale={locale} initialData={{}} page={page}>
        <PreviewRenderer data={page.data} params={params} searchParams={searchParams} />
        <Toaster />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
