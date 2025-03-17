import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
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
        <Typography fontSize={20} className="text-gray-700">
          {translate('cart.empty')}
        </Typography>

        <Image src="/images/empty-cart.png" width={144} height={144} alt="empty cart image" />
      </div>

      <Typography fontSize={16} lineHeight="loose" className="text-gray-600">
        {translate('cart.no-items-added')}
      </Typography>

      <Link href="/" underlineOnHover={false}>
        <Button size="l">{translate('cart.continue-shopping')}</Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
