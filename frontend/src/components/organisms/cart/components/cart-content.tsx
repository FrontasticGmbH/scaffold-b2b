import { useTranslations } from 'use-intl';
import CartItemsList from './cart-items-list';
import EmptyCart from './empty-cart';
import { CartContentProps } from '../types';

const CartContent = ({
  loading,
  className,
  lineItems,
  discountCodes,
  onUpdateQuantity,
  onRemove,
  onAdd,
  onUndoRemove,
  onAddToNewWishlist,
  onClearItem,
}: CartContentProps) => {
  const translate = useTranslations();

  const cartHasProducts = lineItems?.length ?? 0;

  return (
    <div className={className}>
      {cartHasProducts ? (
        <>
          <div className="flex items-center gap-1 font-semibold">
            <p className="text-16 text-gray-700 md:text-18 lg:text-20">{translate('cart.cart')}</p>
            <p className="text-16 text-gray-600 md:text-18 lg:text-20">{`(${lineItems
              ?.filter((item) => !item.isGift && !item.deleted)
              .reduce(
                (sum, item) => sum + (item && item.quantity ? item.quantity : 0),
                0,
              )} ${translate('cart.items')})`}</p>
          </div>
          <CartItemsList
            lineItems={lineItems}
            discountCodes={discountCodes}
            onAdd={onAdd}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onUndoRemove={onUndoRemove}
            onAddToNewWishlist={onAddToNewWishlist}
            onClearItem={onClearItem}
          />
        </>
      ) : (
        <EmptyCart loading={loading} />
      )}
    </div>
  );
};

export default CartContent;
