import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { sdk } from '@/sdk';
import { PageProps } from '@/types/next';
import { getLocalizationInfo } from '@/project.config';
import Renderer from '@/lib/renderer';
import { getTranslations } from '@/utils/I18n/get-translations';
import Toaster from '@/components/atoms/toaster';
import { authenticate } from '@/utils/server/authenticate';
import { Providers } from '@/providers';
import fetchPageData from '@/utils/server/fetch-page-data';
import fetchBusinessUnits from '@/utils/server/fetchBusinessUnits';
import fetchAssociate from '@/utils/server/fetch-associate';

/* Start of Route Segments */

export const dynamic = 'force-dynamic';

/* End of Route Segments */

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale: nextLocale } = params;

  sdk.defaultConfigure(nextLocale);

  const response = await fetchPageData(params, searchParams);

  if (response.isError) return {};

  const { seoTitle, seoDescription, seoKeywords } = response.data.pageFolder?.configuration;

  const { locale } = getLocalizationInfo(nextLocale);

  return {
    title: seoTitle?.[locale],
    description: seoDescription?.[locale],
    keywords: seoKeywords?.[locale],
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale, slug } = params;

  sdk.defaultConfigure(locale);

  const { loggedIn, attemptingToAuth, auth } = await authenticate(slug);

  //If target page is not found skip authentication logic
  if (slug?.[0] !== '404') {
    if (!loggedIn && !attemptingToAuth) return redirect(`/${locale}/login/`);

    if (loggedIn && attemptingToAuth) return redirect(`/${locale}/`);
  }

  const [page, businessUnits, associate] = await Promise.all([
    fetchPageData(params, searchParams),
    fetchBusinessUnits(loggedIn),
    fetchAssociate(loggedIn),
  ]);

  if (page.isError) return redirect(`/${locale}/404`);

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
      <Providers
        translations={translations}
        locale={locale}
        initialData={{
          account: auth.isError ? {} : auth.data,
          associate: associate.isError ? {} : associate.data,
          businessUnits: businessUnits.isError ? [] : businessUnits.data,
        }}
        page={page}
      >
        <Renderer data={page.data} params={params} searchParams={searchParams} />
        <Toaster />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
