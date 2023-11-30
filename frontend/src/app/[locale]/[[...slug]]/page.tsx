import { Metadata } from 'next';
import { sdk } from '@/sdk';
import { PageProps } from '@/types/next';
import { getLocalizationInfo } from '@/project.config';
import Renderer from '@/lib/renderer';
import tastics from '@/lib/tastics';
import { getTranslations } from '@/utils/I18n/get-translations';
import Toaster from '@/components/atoms/toaster';
import { authenticate } from '@/utils/server/authenticate';
import { Providers } from '@/providers';
import getServerOptions from '@/utils/server/getServerOptions';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: nextLocale, slug } = params;

  sdk.configureForNext(nextLocale);

  const response = await sdk.page.getPage({ path: `/${slug?.join('/') ?? ''}` });

  if (response.isError) return {};

  const { seoTitle, seoDescription, seoKeywords } = response.data.pageFolder.configuration;

  const { locale } = getLocalizationInfo(nextLocale);

  return {
    title: seoTitle?.[locale],
    description: seoDescription?.[locale],
    keywords: seoKeywords?.[locale],
  };
}

export const revalidate = 300; // 5 minutes
export const fetchCache = 'force-cache';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, slug } = params;

  sdk.configureForNext(locale);

  const auth = await authenticate(slug);

  const response = await sdk.page.getPage({
    path: `/${slug?.join('/') ?? ''}`,
    query: searchParams as Record<string, string>,
    ...getServerOptions(),
  });

  if (response.isError) return <></>;

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
    <Providers translations={translations} locale={locale} accountResult={auth}>
      <Renderer data={response.data} tastics={tastics} searchParams={searchParams} />
      <Toaster />
    </Providers>
  );
}
