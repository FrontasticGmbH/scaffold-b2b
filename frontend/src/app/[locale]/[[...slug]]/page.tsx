import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Toaster from '@/components/atoms/toaster';
import Renderer from '@/lib/renderer';
import { isRedirectResponse } from '@/lib/utils/is-redirect-response';
import { Providers } from '@/providers';
import { sdk } from '@/sdk';
import { PageProps } from '@/types/next';
import { getSeoInfoFromPageResponse } from '@/utils/lib/seo-tools';
import { authenticate } from '@/utils/server/authenticate';
import fetchAssociate from '@/utils/server/fetch-associate';
import fetchCategories from '@/utils/server/fetch-categories';
import fetchPageData from '@/utils/server/fetch-page-data';
import fetchProjectSettings from '@/utils/server/fetch-project-settings';
import fetchBusinessUnits from '@/utils/server/fetchBusinessUnits';

/* Start of Route Segments */

export const dynamic = 'force-dynamic';

/* End of Route Segments */

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale: nextLocale } = params;

  sdk.defaultConfigure(nextLocale);

  const [response, flatCategories] = await Promise.all([fetchPageData(params, searchParams), fetchCategories('flat')]);

  if (response.isError || isRedirectResponse(response.data)) {
    return {};
  }

  const categories = flatCategories.isError ? [] : flatCategories.data.items;
  const { seoTitle, seoDescription, seoKeywords } = getSeoInfoFromPageResponse(response.data, categories);

  return {
    title: seoTitle ?? '',
    description: seoDescription ?? '',
    keywords: seoKeywords ?? '',
  };
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale, slug } = params;

  sdk.defaultConfigure(locale);

  const { loggedIn, attemptingToAuth, auth } = await authenticate(slug);

  //If target page is not found skip authentication logic
  if (slug?.[0] !== '404') {
    if (!loggedIn && !attemptingToAuth) {
      return redirect(`/${locale}/login/`);
    }

    if (loggedIn && attemptingToAuth) {
      return redirect(`/${locale}/`);
    }
  }

  // Fetch page data
  const [page, businessUnits, associate, projectSettings, flatCategories, treeCategories] = await Promise.all([
    fetchPageData(params, searchParams),
    fetchBusinessUnits(loggedIn),
    fetchAssociate(loggedIn),
    fetchProjectSettings(),
    fetchCategories('flat'),
    fetchCategories('tree'),
  ]);

  if (page.isError) {
    return redirect(`/${locale}/404`);
  }

  if (isRedirectResponse(page.data)) {
    redirect(page.data.target);
  }

  return (
    <div
      data-theme={
        !page.isError && page.data.pageFolder.configuration?.displayTheme
          ? page.data.pageFolder.configuration.displayTheme
          : 'default'
      }
    >
      <Providers
        page={{ ...page, data: page.data }}
        locale={locale}
        initialData={{
          account: auth.isError ? undefined : auth.data,
          associate: associate.isError ? undefined : associate.data,
          businessUnits: businessUnits.isError ? [] : businessUnits.data,
          projectSettings: projectSettings.isError ? undefined : projectSettings.data,
          flatCategories: flatCategories.isError ? undefined : flatCategories.data,
          treeCategories: treeCategories.isError ? undefined : treeCategories.data,
        }}
      >
        <Renderer
          data={page.data}
          params={params}
          searchParams={searchParams}
          projectSettings={projectSettings.isError ? undefined : projectSettings.data}
          flatCategories={flatCategories.isError ? [] : flatCategories.data.items}
          treeCategories={treeCategories.isError ? [] : treeCategories.data.items}
        />
        <Toaster />
      </Providers>

      <div id="react-modal-custom-portal" />
    </div>
  );
}
