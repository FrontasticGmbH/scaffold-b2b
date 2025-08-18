import Button from '@/components/atoms/button';
import InfoBanner from '@/components/molecules/info-banner';
import PurchaseListItem from '@/components/molecules/purchase-list-item';
import Confirmation from '@/components/organisms/confirmation';
import useEntityToasters from '@/hooks/useEntityToasters';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'use-intl';
import PreviousPageLink from '../../components/previous-page-link';
import EditPurchaseListModal from './components/edit-modal';
import EmptyPurchaseList from './components/empty-purchase-list';
import { PurchaseListDetailPageProps } from './types';

const PurchaseListDetailPage = ({
  purchaseList,
  onUpdatePurchaseList,
  onDeletePurchaseList,
  onAddPurchaseListToCart,
  onAddItemToCart,
  onRemoveItem,
  onUpdateItem,
  image,
  permissions,
  accountId,
}: PurchaseListDetailPageProps) => {
  const translate = useTranslations();

  const { showDeletedMessage, showDeletedFailedMessage } = useEntityToasters('purchaselist');

  const [isOrderingList, setIsOrderingList] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  if (!purchaseList) return <></>;

  const {
    UpdateOthersShoppingLists,
    DeleteMyShoppingLists,
    UpdateMyShoppingLists,
    DeleteOthersShoppingLists,
    CreateMyCarts,
    UpdateMyCarts,
    UpdateOthersCarts,
    CreateOthersCarts,
  } = permissions || {};

  const itemsCount = purchaseList.items.length;
  const isOwner = purchaseList?.account?.accountId === accountId;
  const canEdit = isOwner ? UpdateMyShoppingLists : UpdateOthersShoppingLists;
  const canDelete = isOwner ? DeleteMyShoppingLists : DeleteOthersShoppingLists;
  const canUpdateCart = UpdateMyCarts && CreateMyCarts;

  return (
    <div className="pt-6">
      {!canEdit && !canDelete && !canUpdateCart && (
        <InfoBanner className="mb-8">
          <p className="flex items-start gap-2 text-gray-600 lg:items-center">
            <InformationCircleIcon className="size-1/4 text-blue-600 md:size-10 lg:size-7" />
            <span>
              <b>{translate('common.view-only')} - </b>
              {translate('dashboard.purchase-list-cannot-order-extended')}
            </span>
          </p>
        </InfoBanner>
      )}

      <div className="flex flex-col-reverse gap-5 border-b border-neutral-400 pb-4 md:mt-4 md:items-start md:justify-between md:pb-6 lg:flex-row lg:pb-8">
        <div className="hidden md:block">
          <h1 className="mb-3 text-18 font-semibold leading-tight text-gray-700 md:text-20 lg:text-24">
            {purchaseList.name}
          </h1>
          {purchaseList.account && (
            <p className="text-14 leading-tight text-gray-600 lg:text-16">
              {`${translate('common.created-by')}: ${purchaseList.account.firstName}  `}
              {purchaseList.createdAt && (
                <span>{`${translate('common.in')} ${format(new Date(purchaseList.createdAt), 'MM/dd/yyyy HH:mm')}`}</span>
              )}
            </p>
          )}
          {!purchaseList?.account && (
            <p className="text-14 leading-tight text-gray-600 lg:text-16">{purchaseList.description}</p>
          )}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between lg:w-fit">
          <div>
            <PreviousPageLink />
          </div>
          <div className="mb-3 block md:hidden">
            <h1 className="mt-2 pb-2 text-18 font-semibold leading-tight text-gray-700 md:py-7 md:text-20 lg:py-9 lg:text-24">
              {purchaseList.name}
            </h1>
            {purchaseList.account && (
              <p className="text-14 leading-tight text-gray-600 lg:text-16">
                {`${translate('common.created-by')}: ${purchaseList.account.firstName}  `}
                {purchaseList.createdAt && (
                  <span>{`${translate('common.in')} ${format(new Date(purchaseList.createdAt), 'MM/dd/yyyy HH:mm')}`}</span>
                )}
              </p>
            )}
            {!purchaseList?.account && (
              <p className="text-14 leading-tight text-gray-600 lg:text-16">{purchaseList.description}</p>
            )}
          </div>
          <div className="flex w-full flex-col items-stretch gap-4 md:w-fit md:flex-row md:items-center md:gap-3">
            <EditPurchaseListModal
              purchaseList={purchaseList}
              onUpdatePurchaseList={onUpdatePurchaseList}
              disabled={!canEdit}
            >
              {!canEdit && (
                <Tooltip
                  id="edit-purchase-list-tooltip"
                  content={translate('dashboard.purchase-list-cannot-edit')}
                  place="top"
                  openEvents={{ mouseover: true, focus: true }}
                />
              )}

              <span data-tooltip-id="edit-purchase-list-tooltip">
                <Button
                  className="w-full px-0 py-[8px] md:min-w-[75px]"
                  size="m"
                  variant="secondary"
                  disabled={!canEdit}
                >
                  {translate('common.edit')}
                </Button>
              </span>
            </EditPurchaseListModal>
            <Confirmation
              translations={{
                title: translate('dashboard.purchase-list-delete'),
                summary: translate('dashboard.purchase-list-delete-confirm'),
                cancel: translate('common.cancel'),
                confirm: translate('common.delete'),
              }}
              onConfirm={async () => {
                const isSuccessful = await onDeletePurchaseList?.(purchaseList.id);

                if (isSuccessful) {
                  showDeletedMessage();
                } else {
                  showDeletedFailedMessage();
                }

                setIsConfirmationOpen(false);
              }}
              onCancel={() => setIsConfirmationOpen(false)}
              isOpen={isConfirmationOpen}
            >
              {!canDelete && (
                <Tooltip
                  id="delete-purchase-list-tooltip"
                  content={translate('dashboard.purchase-list-cannot-delete')}
                  place="top"
                  openEvents={{ mouseover: true, focus: true }}
                />
              )}
              <span data-tooltip-id="delete-purchase-list-tooltip">
                <Button
                  className="w-full px-0 py-[8px] md:min-w-[75px]"
                  size="m"
                  variant="secondary"
                  disabled={!canDelete}
                  onClick={() => {
                    if (canDelete) {
                      setIsConfirmationOpen(!isConfirmationOpen);
                    }
                  }}
                >
                  {translate('common.delete')}
                </Button>
              </span>
            </Confirmation>
            {!canUpdateCart && (
              <Tooltip
                id="order-purchase-list-tooltip"
                content={translate('dashboard.purchase-list-cannot-add-to-cart')}
                place="top"
                openEvents={{ mouseover: true, focus: true }}
              />
            )}

            <span data-tooltip-id="order-purchase-list-tooltip">
              <Button
                className="flex w-full items-center justify-center px-0 py-[8px] md:order-2 md:min-w-[75px]"
                size="m"
                loading={isOrderingList}
                onClick={async () => {
                  if (!canUpdateCart) return;

                  setIsOrderingList(true);
                  await onAddPurchaseListToCart?.();
                  setIsOrderingList(false);
                }}
                disabled={!itemsCount || !canUpdateCart}
              >
                <ShoppingCartIcon className="mr-2 size-4" />
                {translate('cart.add')}
              </Button>
            </span>
          </div>
        </div>
      </div>

      <p className="py-6 font-semibold text-gray-700 lg:pb-9 lg:pt-8 lg:text-18">
        {translate('common.purchase-list')}{' '}
        <span className="text-gray-600">
          ({itemsCount} {translate(itemsCount === 1 ? 'common.item' : 'common.items')})
        </span>
      </p>

      <div className="flex flex-col items-stretch gap-3 lg:gap-4">
        {!purchaseList.items.length ? (
          <EmptyPurchaseList image={image} />
        ) : (
          purchaseList.items.map((item) => (
            <PurchaseListItem
              key={item.id}
              item={item}
              onRemove={async () => !!onRemoveItem?.(item.id)}
              onAddToCart={async () => !!onAddItemToCart?.(item)}
              onQuantityChange={async (quantity) => !!onUpdateItem?.({ ...item, quantity })}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PurchaseListDetailPage;
