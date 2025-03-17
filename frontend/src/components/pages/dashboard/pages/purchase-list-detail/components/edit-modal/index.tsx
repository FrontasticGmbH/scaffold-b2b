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
      <div onClick={onOpen}>{children}</div>
      <ResponsiveModal isOpen={isOpen} onRequestClose={onClose} closeButton className="lg:w-[600px]">
        <div className="mx-auto p-4 md:p-6 lg:max-w-[400px] lg:p-0 lg:py-6">
          <h4 className="pb-4 font-semibold text-gray-800 md:text-20">{translate('dashboard.purchase-list-edit')}</h4>
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
