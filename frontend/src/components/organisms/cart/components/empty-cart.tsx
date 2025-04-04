import Button from '@/components/atoms/button';
import Image from '@/components/atoms/Image';
import { useTranslations } from 'use-intl';
import Link from '@/components/atoms/link';
import LoadingIcon from '@/components/atoms/loading-icon';

const EmptyCart = ({ loading }: { loading?: boolean }) => {
  const translate = useTranslations();

  if (loading)
    return (
      <div className="flex w-full justify-center">
        <LoadingIcon svgWidth={20} svgHeight={20} className="fill-gray-700" />
      </div>
    );

  return (
    <div className="mx-auto grid w-fit place-items-center gap-12">
      <div className="grid place-items-center gap-6">
        <p className="text-20 text-gray-700">{translate('cart.empty')}</p>

        <Image src="/images/empty-cart.png" width={144} height={144} alt="empty cart image" />
      </div>

      <p className="text-16 leading-loose text-gray-600">{translate('cart.no-items-added')}</p>

      <Link href="/" underlineOnHover={false}>
        <Button size="l">{translate('cart.continue-shopping')}</Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
