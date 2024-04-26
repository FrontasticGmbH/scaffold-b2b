import { PageProps } from '@/types/next';
import { sdk } from '@/sdk';
import { Providers } from '@/providers';
import PreviewRenderer from '@/lib/preview-renderer';
import { getTranslations } from '@/utils/I18n/get-translations';

export const fetchCache = 'force-no-store';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, previewId } = params;

  sdk.defaultConfigure(locale);

  const page = await sdk.page.getPreview({ previewId: previewId as string });

  if (page.isError || !page.data.data) return <></>;

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
    <Providers translations={translations} locale={locale} initialData={{}} tracing={page.tracing}>
      <PreviewRenderer data={page.data} params={params} searchParams={searchParams} />
    </Providers>
  );
}
