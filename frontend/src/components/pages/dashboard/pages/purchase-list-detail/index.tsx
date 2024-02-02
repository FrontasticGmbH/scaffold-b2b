import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Confirmation from '@/components/organisms/confirmation';
import PurchaseListItem from '@/components/molecules/purchase-list-item';
import useEntityToasters from '@/hooks/useEntityToasters';
import EditPurchaseListModal from './components/edit-modal';
import { PurchaseListDetailPageProps } from './types';
import PreviousPageLink from '../../components/previous-page-link';

const PurchaseListDetailPage = ({
  purchaseList,
  onUpdatePurchaseList,
  onDeletePurchaseList,
  onOrderPurchaseList,
  onAddItemToCart,
  onRemoveItem,
  onUpdateItem,
}: PurchaseListDetailPageProps) => {
  const { translate } = useTranslation();

  const { showDeletedMessage, showDeletedFailedMessage } = useEntityToasters('purchaselist');

  if (!purchaseList) return <></>;

  const itemsCount = purchaseList.items.length;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-neutral-400 pb-4 md:flex-row md:items-start md:justify-between md:pb-6 lg:pb-8">
        <div>
          <h1 className="py-6 text-18 font-extrabold leading-[100%] text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
            {purchaseList.name}
          </h1>
          <p className="text-14 leading-[100%] text-gray-600 lg:text-16">{purchaseList.description}</p>
        </div>
        <div className="flex items-center gap-3 md:pt-5 lg:pt-8">
          <PreviousPageLink className="hidden md:block" />
          <div className="flex w-full flex-col items-stretch gap-4 md:w-fit md:flex-row md:items-center md:gap-3">
            <Button
              className="w-full px-[0px] py-[8px] md:order-[2] md:w-[75px]"
              size="m"
              disabled
              onClick={() => onOrderPurchaseList?.(purchaseList.id)}
            >
              {translate('common.order')}
            </Button>
            <EditPurchaseListModal purchaseList={purchaseList} onUpdatePurchaseList={onUpdatePurchaseList}>
              <Button className="w-full px-[0px] py-[8px] md:w-[75px]" size="m" variant="secondary">
                {translate('common.edit')}
              </Button>
            </EditPurchaseListModal>
            <Confirmation
              translations={{
                title: translate('dashboard.purchase.list.delete'),
                summary: translate('dashboard.purchase.list.delete.confirm'),
                cancel: translate('common.cancel'),
                confirm: translate('common.delete'),
              }}
              onConfirm={async () => {
                const success = await onDeletePurchaseList?.(purchaseList.id);

                if (success) showDeletedMessage();
                else showDeletedFailedMessage();
              }}
            >
              <Button className="w-full px-[0px] py-[8px] md:w-[75px]" size="m" variant="secondary">
                {translate('common.delete')}
              </Button>
            </Confirmation>
          </div>
        </div>
      </div>

      <p className="py-6 lg:pb-9 lg:pt-8 lg:text-18">
        {translate('common.purchase.list')}{' '}
        <span className="text-gray-600">
          ({itemsCount} {translate(itemsCount === 1 ? 'common.item' : 'common.items')})
        </span>
      </p>

      <div className="flex flex-col items-stretch gap-3 lg:gap-4">
        {purchaseList.items.map((item) => (
          <PurchaseListItem
            key={item.id}
            item={item}
            onRemove={async () => !!onRemoveItem?.(item.id)}
            onAddToCart={async () => !!onAddItemToCart?.(item)}
            onQuantityChange={async (quantity) => !!onUpdateItem?.({ ...item, quantity })}
          />
        ))}
      </div>
    </div>
  );
};

export default PurchaseListDetailPage;
