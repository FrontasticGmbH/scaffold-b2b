import Button from '@/components/atoms/button';
import Image from '@/components/atoms/Image';
import { ImageProps } from '@/components/atoms/Image/types';
import Link from '@/components/atoms/link';
import { useTranslations } from 'next-intl';

const EmptyPurchaseList = ({ image }: { image?: ImageProps }) => {
  const translate = useTranslations();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-md border border-solid border-gray-300 p-12">
      <Image src={image?.media?.file} alt={translate('wishlist.empty')} className="size-32" />
      <p className="text-gray-600">{`${translate('dashboard.purchase-list-no-items')}.`}</p>
      <Link href="/">
        <Button> {translate('wishlist.add-items')}</Button>
      </Link>
    </div>
  );
};

export default EmptyPurchaseList;
