import { useTranslations } from 'use-intl';
import { Product } from '@/types/entity/product';
import CartItem from './cart-item';
import { CartItemsListProps } from '../types';
import CartGiftItem from './cart-gift-item';

const CartItemsList = ({
  lineItems,
  discountCodes,
  onUpdateQuantity,
  onRemove,
  onUndoRemove,
  onAdd,
  onAddToNewWishlist,
  onClearItem,
}: CartItemsListProps) => {
  const translate = useTranslations();

  const inStockItems = lineItems?.filter((item) => !!item.inStock) ?? [];

  const inStockPaidItems = inStockItems.filter((item) => !item.isGift);
  const inStockFreeItemsGroups = inStockItems
    .filter((item) => item.isGift && !item.deleted)
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.discountsAppliedPerCount?.[0].details.includedDiscounts[0].discount.name ?? 'cart.buy-and-get-promo']: {
          discount: { title: item.discountsAppliedPerCount?.[0].details.includedDiscounts[0].discount.name ?? '' },
          items: [
            ...(acc[
              item.discountsAppliedPerCount?.[0].details.includedDiscounts[0].discount.name ?? 'cart.buy-and-get-promo'
            ]?.items ?? []),
            item,
          ],
        },
      }),
      {} as Record<string, { discount: { title: string }; items: Product[] }>,
    );

  const soldOutItems = lineItems?.filter((item) => !item.inStock) ?? [];

  return (
    <div className="mt-3 lg:mt-8 lg:border-none">
      {inStockPaidItems?.map((lineItem) => {
        const discountsSet = new Set<string>();
        (lineItem.discountsAppliedPerCount ?? []).forEach((pc) => {
          pc.details.includedDiscounts.forEach((inc) => {
            if (inc.discount?.name) discountsSet.add(inc.discount.name);
          });
        });
        const discountCodesApplied = Array.from(discountsSet).map((name) => {
          const owningCode = discountCodes?.find((dc) => (dc.discounts ?? []).some((d) => d?.name === name));
          return { name, code: owningCode?.code ?? '' };
        });

        return (
          <CartItem
            key={lineItem.id}
            onAddToNewWishlist={(list) => onAddToNewWishlist(list, lineItem.sku, lineItem.quantity ?? 1)}
            item={lineItem}
            classNames={{ moveToWishlist: 'text-14' }}
            onUndoRemove={async () =>
              onUndoRemove?.(lineItem.id) || onAdd?.(lineItem.sku as string, lineItem.quantity ?? 1)
            }
            onUpdateQuantity={(qty) =>
              qty === 0 ? onRemove(lineItem.id as string) : onUpdateQuantity(lineItem.id as string, qty)
            }
            onRemove={() => onRemove(lineItem.id)}
            onClearItem={onClearItem}
            discountCodesApplied={discountCodesApplied}
          />
        );
      })}

      {Object.values(inStockFreeItemsGroups).map(({ discount, items }) => (
        <div className="" key={discount.title}>
          <div className="mt-4 flex flex-col items-stretch gap-8">
            {items.map((lineItem) => (
              <CartGiftItem
                key={lineItem.id}
                item={lineItem}
                discountName={discount.title}
                onRemove={() => onRemove(lineItem.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {soldOutItems?.length > 0 && (
        <div className="border-t border-neutral-400 pt-9">
          <h3 className="text-16 font-semibold md:text-18 lg:text-22">{translate('product.sold-out')}</h3>
          <div className="mt-12">
            {soldOutItems.map((lineItem) => (
              <div key={lineItem.id}>
                <CartItem
                  onAddToNewWishlist={(list) => onAddToNewWishlist(list, lineItem.sku)}
                  item={lineItem}
                  classNames={{ moveToWishlist: 'text-14' }}
                  onUpdateQuantity={(qty) =>
                    qty === 0 ? onRemove(lineItem.id as string) : onUpdateQuantity(lineItem.id as string, qty)
                  }
                  onRemove={() => onRemove(lineItem.id as string)}
                  onUndoRemove={() => onAdd?.(lineItem.sku as string, lineItem.quantity ?? 1)}
                  onClearItem={onClearItem}
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
