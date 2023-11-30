import { LayoutProps } from '@/types/next';
import { inter } from '@/fonts';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/global/index.css';

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = params;

  return (
    <html lang={locale} className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
