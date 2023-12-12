import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '@/components/atoms/typography';
import CartItemsList from './cart-items-list';
import EmptyCart from './empty-cart';
import { CartContentProps } from '../types';

const CartContent = ({ className, lineItems, onUpdateQuantity, onRemove }: CartContentProps) => {
  const { translate } = useTranslation();

  const cartHasProducts = lineItems?.length ?? 0;

  return (
    <div className={className}>
      {cartHasProducts ? (
        <>
          <div className="flex items-center gap-1">
            <Typography fontSize={16} className="text-gray-700 md:text-18 lg:text-20">
              {translate('cart.cart')}
            </Typography>
            <Typography fontSize={16} className="text-neutral-900 md:text-18 lg:text-20">{`(${
              lineItems?.length
            } ${translate('cart.items')})`}</Typography>
          </div>
          <CartItemsList lineItems={lineItems} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default CartContent;
