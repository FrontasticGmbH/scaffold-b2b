import Button from '@/components/atoms/button';
import MoveToList from '@/components/molecules/move-to-list';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import usePurchaseList from '@/lib/hooks/usePurchaseList';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { QueueListIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CartItemFooterProps } from '../types';

const CartItemFooter = ({
  className,
  onRemove,
  item,
  onAddToNewWishlist,
  isQuotationCart,
  showRemoveOnly = false,
}: CartItemFooterProps) => {
  const translate = useTranslations();
  const ClassNames = classnames('flex items-center gap-3', className);

  const { selectedStore } = useStoreAndBusinessUnits();

  const { purchaseLists } = usePurchaseLists(selectedStore?.key);
  const { addItem } = usePurchaseList();

  return (
    <div className={ClassNames}>
      {!showRemoveOnly && (
        <div className="flex shrink-0 items-center gap-1">
          <QueueListIcon className="size-[16px] text-primary" />
          <MoveToList
            disabled={isQuotationCart}
            lists={purchaseLists?.items.map(mapPurchaseList).map((list) => ({ id: list.id, label: list.name })) ?? []}
            onAddNewList={onAddToNewWishlist}
            onSubmit={async (selected) => {
              await Promise.all(
                selected.map((listId) => addItem({ wishlistId: listId, sku: item.sku ?? '', count: 1 })),
              );
            }}
          />
        </div>
      )}

      {!showRemoveOnly && <span className="text-neutral-400">|</span>}

      <div className="flex items-center gap-1">
        <XMarkIcon className="size-[16px] text-primary" />
        <Button
          variant="ghost"
          size="fit"
          className="flex-1 text-center text-14 font-medium text-primary md:flex-[unset] md:text-start"
          onClick={onRemove}
          disabled={isQuotationCart}
        >
          {translate('common.remove')}
        </Button>
      </div>
    </div>
  );
};

export default CartItemFooter;
