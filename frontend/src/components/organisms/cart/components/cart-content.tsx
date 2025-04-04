import { useTranslations } from 'use-intl';
import CartItemsList from './cart-items-list';
import EmptyCart from './empty-cart';
import { CartContentProps } from '../types';

const CartContent = ({
  loading,
  className,
  lineItems,
  onUpdateQuantity,
  onRemove,
  onAdd,
  onAddToNewWishlist,
}: CartContentProps) => {
  const translate = useTranslations();

  const cartHasProducts = lineItems?.length ?? 0;

  return (
    <div className={className}>
      {cartHasProducts ? (
        <>
          <div className="flex items-center gap-1">
            <p className="text-16 text-gray-700 md:text-18 lg:text-20">{translate('cart.cart')}</p>
            <p className="text-16 text-gray-600 md:text-18 lg:text-20">{`(${lineItems
              ?.filter((item) => !item.deleted)
              .reduce(
                (sum, item) => sum + (item && item.quantity ? item.quantity : 0),
                0,
              )} ${translate('cart.items')})`}</p>
          </div>
          <CartItemsList
            lineItems={lineItems}
            onAdd={onAdd}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onAddToNewWishlist={onAddToNewWishlist}
          />
        </>
      ) : (
        <EmptyCart loading={loading} />
      )}
    </div>
  );
};

export default CartContent;
