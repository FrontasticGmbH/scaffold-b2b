import useTranslation from '@/providers/I18n/hooks/useTranslation';
import CartItem from './cart-item';
import { CartItemsListProps } from '../types';

const CartItemsList = ({
  lineItems,
  onUpdateQuantity,
  onRemove,
  onAdd,
  onAddToNewWishlist,
  isQuotationCart,
}: CartItemsListProps) => {
  const { translate } = useTranslation();

  const inStockItems = lineItems?.filter((item) => !!item.variant?.isOnStock) ?? [];
  const soldOutItems = lineItems?.filter((item) => !item.variant?.isOnStock) ?? [];

  return (
    <div className="mt-3 divide-y divide-neutral-400 border-t border-neutral-400 lg:mt-8 lg:border-none">
      {inStockItems?.map((lineItem) => (
        <div key={lineItem.lineItemId}>
          <CartItem
            onAddToNewWishlist={(list) => onAddToNewWishlist(list, lineItem.variant?.sku, lineItem.count ?? 1)}
            item={lineItem}
            classNames={{ moveToWishlist: 'text-14' }}
            onUndoRemove={() => onAdd(lineItem.variant?.sku as string, lineItem.count ?? 1)}
            onUpdateQuantity={(qty) =>
              qty === 0 ? onRemove(lineItem.lineItemId as string) : onUpdateQuantity(lineItem.lineItemId as string, qty)
            }
            onRemove={() => onRemove(lineItem.lineItemId as string)}
            isQuotationCart={isQuotationCart}
          />
        </div>
      ))}

      {soldOutItems?.length > 0 && (
        <div className="border-t border-neutral-400 pt-9">
          <h3 className="text-16 md:text-18 lg:text-22">{translate('product.sold.out')}</h3>
          <div className="mt-12">
            {soldOutItems.map((lineItem) => (
              <div key={lineItem.lineItemId}>
                <CartItem
                  onAddToNewWishlist={(list) => onAddToNewWishlist(list, lineItem.variant?.sku)}
                  item={lineItem}
                  classNames={{ moveToWishlist: 'text-14' }}
                  onUpdateQuantity={(qty) =>
                    qty === 0
                      ? onRemove(lineItem.lineItemId as string)
                      : onUpdateQuantity(lineItem.lineItemId as string, qty)
                  }
                  onRemove={() => onRemove(lineItem.lineItemId as string)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemsList;
