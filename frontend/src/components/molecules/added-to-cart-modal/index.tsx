import React from 'react';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import ModalHeader from '@/components/molecules/added-to-cart-modal/components/modal-header';
import ItemDetails from '@/components/molecules/added-to-cart-modal/components/item-details';
import ItemPricing from '@/components/molecules/added-to-cart-modal/components/item-pricing';
import ActionButtons from '@/components/molecules/added-to-cart-modal/components/action-buttons';
import FrequentlyBoughtContainer from '@/components/molecules/added-to-cart-modal/components/frequently-bought';
import { AddedToCartModalProps } from './types';

const AddedToCartModal = ({ item, onClose, onQuantityChange, sliderProducts }: AddedToCartModalProps) => {
  return (
    <ResponsiveModal isOpen={!!item} onRequestClose={onClose} closeButton className="md:w-[600px]">
      {item && (
        <div className="m-4 md:m-6">
          <ModalHeader />
          <div className="row-start-1 grid grid-cols-2 md:grid-cols-6">
            <ItemDetails item={item} />
            <ItemPricing item={item} quantity={item?.quantity} onQuantityChange={onQuantityChange} />
            <ActionButtons onClose={onClose} />
          </div>
        </div>
      )}
      <FrequentlyBoughtContainer sliderProducts={sliderProducts} />
    </ResponsiveModal>
  );
};

export default AddedToCartModal;
