import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';

const DesktopOnly = () => {
  const translate = useTranslations();

  return (
    <section className="flex h-[50vh] items-center justify-center lg:hidden">
      <div className="flex max-w-[650px] flex-col items-center text-center text-gray-600">
        <h1 className="text-3xl font-semibold">{translate('common.desktop-only-message-title')}</h1>
        <p className="my-4 px-3">{translate('common.desktop-only')}</p>
        <Link href="/dashboard" underlineOnHover={false}>
          <Button variant="primary" className="py-3">
            {translate('common.return-to-dashboard')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default DesktopOnly;
