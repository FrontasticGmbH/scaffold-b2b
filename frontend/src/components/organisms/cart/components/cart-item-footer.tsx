import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import MoveToList from '@/components/molecules/move-to-list';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { classnames } from '@/utils/classnames/classnames';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { CartItemFooterProps } from '../types';

const CartItemFooter = ({ className, onRemove, item }: CartItemFooterProps) => {
  const { translate } = useTranslation();
  const ClassNames = classnames('mt-5 flex items-center gap-3 py-5 md:mt-8 md:gap-5 md:py-0', className);

  const { selectedStore } = useStoreAndBusinessUnits();

  const { purchaseLists, addItem } = usePurchaseLists(selectedStore?.key);

  return (
    <div className={ClassNames}>
      <MoveToList
        lists={purchaseLists.map(mapPurchaseList).map((list) => ({ id: list.id, label: list.name }))}
        onSubmit={async (selected) => {
          await Promise.all(
            selected.map((listId) => addItem({ wishlistId: listId, sku: item.variant?.sku ?? '', count: 1 })),
          );
        }}
      />

      <Typography className="text-neutral-400">|</Typography>

      <Button
        variant="ghost"
        size="fit"
        className="flex-1 text-center text-14 font-medium text-gray-700 md:flex-[unset] md:text-start"
        onClick={onRemove}
      >
        {translate('common.remove')}
      </Button>
    </div>
  );
};

export default CartItemFooter;
