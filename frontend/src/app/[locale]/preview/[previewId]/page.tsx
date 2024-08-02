import { PageProps } from '@/types/next';
import { sdk } from '@/sdk';
import { Providers } from '@/providers';
import PreviewRenderer from '@/lib/preview-renderer';
import { getTranslations } from '@/utils/I18n/get-translations';
import Toaster from '@/components/atoms/toaster';

export const fetchCache = 'force-no-store';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, previewId } = params;

  sdk.defaultConfigure(locale);

  const page = await sdk.page.getPreview({ previewId: previewId as string });

  if (page.isError) return <></>;

  const translations = await getTranslations(
    [locale],
    [
      'common',
      'account',
      'cart',
      'checkout',
      'customer-support',
      'error',
      'newsletter',
      'orders',
      'payment',
      'product',
      'success',
      'thank-you',
      'wishlist',
      'dashboard',
      'quick-order',
    ],
  );

  return (
    <div data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}>
      <Providers translations={translations} locale={locale} initialData={{}} page={page}>
        <PreviewRenderer data={page.data} params={params} searchParams={searchParams} />
        <Toaster />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
