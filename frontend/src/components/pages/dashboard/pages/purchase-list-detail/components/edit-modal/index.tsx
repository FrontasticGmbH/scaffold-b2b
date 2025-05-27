import React, { useEffect } from 'react';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import useDisclosure from '@/hooks/useDisclosure';
import { useTranslations } from 'use-intl';
import useScrollBlock from '@/hooks/useScrollBlock';
import PurchaseListForm from '../../../purchase-lists/forms/purchase-list';
import { PurchaseListDetailPageProps } from '../../types';

const EditPurchaseListModal = ({
  children,
  purchaseList,
  onUpdatePurchaseList,
  disabled,
}: React.PropsWithChildren<PurchaseListDetailPageProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const translate = useTranslations();

  const { blockScroll } = useScrollBlock();

  useEffect(() => {
    blockScroll(isOpen);

    return () => blockScroll(false);
  }, [isOpen, blockScroll]);

  return (
    <>
      <div onClick={disabled ? () => {} : onOpen}>{children}</div>
      <ResponsiveModal isOpen={isOpen} onRequestClose={onClose} closeButton className="max-w-[500px]">
        <div className="max-w-[500px]">
          <h4 className="mt-4 pb-4 pl-6 font-semibold text-gray-800 md:text-20">
            {translate('dashboard.purchase-list-edit')}
          </h4>
          <PurchaseListForm
            id={purchaseList.id}
            purchaseLists={[purchaseList]}
            classNames={{ form: 'p-0 border-none md:p-0 lg:p-0', buttonsContainer: 'justify-end' }}
            onUpdatePurchaseList={onUpdatePurchaseList}
            onSave={onClose}
            onCancel={onClose}
          />
        </div>
      </ResponsiveModal>
    </>
  );
};

export default EditPurchaseListModal;
