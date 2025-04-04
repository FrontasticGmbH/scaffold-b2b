import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import { WishlistToastProps } from '../types';

const WishlistToast = ({ wishlist }: WishlistToastProps) => {
  const translate = useTranslations();

  return (
    <div className="flex gap-1">
      <p className="text-14">{translate('wishlist.item-added')}</p>
      <Link className="text-14 font-medium" href={`/shopping-list/${wishlist?.id}`}>
        {wishlist?.label}
      </Link>
    </div>
  );
};

export default WishlistToast;
