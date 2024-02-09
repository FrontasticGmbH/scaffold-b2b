import { useCallback, useEffect, useMemo, useState } from 'react';
import Typography from '@/components/atoms/typography';
import WishlistModal from '@/components/molecules/wishlist-modal';
import useDisclosure from '@/hooks/useDisclosure';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ShoppingListCTAProps, Wishlist } from '../types';

const ShoppingListCTA = ({ getWishlists, addToWishlists, addToNewWishlist }: ShoppingListCTAProps) => {
  const { translate } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [lists, setLists] = useState<Array<Wishlist>>([]);

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(() => Object.keys(checkedBoxes).filter((key) => !!checkedBoxes[key]), [checkedBoxes]);

  const handleChange = (id: string, checked: boolean) => {
    const updated = { ...checkedBoxes };
    updated[id] = checked;

    setCheckedBoxes(updated);
  };

  const fetchLists = useCallback(async () => {
    const shoppingLists = await getWishlists();
    setLists(shoppingLists ?? []);

    const checkedBoxes = shoppingLists?.reduce((acc, list) => {
      acc[list.id] = !!list.productIsInWishlist;
      return acc;
    }, {} as Record<string, boolean>);

    setCheckedBoxes(checkedBoxes ?? {});
  }, [getWishlists]);

  const handleSubmit = () => {
    addToWishlists(selectedIds).then(() => {
      onClose();
    });
  };

  useEffect(() => {
    fetchLists();
  }, [fetchLists, getWishlists]);

  return (
    <div className="mb-1 mt-2 border-y border-neutral-400 py-5 lg:mt-4">
      <Typography onClick={onOpen} className="cursor-pointer leading-[16px] text-gray-700" fontSize={14}>
        {`+ ${translate('product.add.to.list')}`}
      </Typography>
      <WishlistModal
        lists={lists}
        isOpen={isOpen}
        onAddToNewList={addToNewWishlist}
        onSubmit={handleSubmit}
        onClose={onClose}
        handleChange={handleChange}
        selectedIds={selectedIds}
      />
    </div>
  );
};

export default ShoppingListCTA;
