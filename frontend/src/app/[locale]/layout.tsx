import { LayoutProps } from '@/types/next';
import { inter } from '@/fonts';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'flag-icons/css/flag-icons.min.css';
import '@/styles/global/index.css';
import { CookiesProvider } from 'next-client-cookies/server';

export default async function RootLayout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  const { locale } = params;

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
