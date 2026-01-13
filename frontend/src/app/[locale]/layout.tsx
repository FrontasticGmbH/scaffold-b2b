import { inter } from '@/fonts';
import I18nProvider from '@/providers/i18n-provider';
import '@/styles/global/index.css';
import 'flag-icons/css/flag-icons.min.css';
import { getMessages } from 'next-intl/server';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
