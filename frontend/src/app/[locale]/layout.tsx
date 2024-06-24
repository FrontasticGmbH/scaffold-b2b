import { LayoutProps } from '@/types/next';
import { inter } from '@/fonts';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'flag-icons/css/flag-icons.min.css';
import '@/styles/global/index.css';
import { CookiesProvider } from 'next-client-cookies/server';
import fetchPageData from '@/utils/server/fetch-page-data';

export default async function RootLayout({ children, params, searchParams }: LayoutProps) {
  const { locale } = params;

  const page = await fetchPageData(params, searchParams);

  return (
    <html
      lang={locale}
      className={inter.variable}
      data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}
    >
      <body>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
