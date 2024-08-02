import { useCallback, useEffect, useMemo, useState } from 'react';
import Typography from '@/components/atoms/typography';
import WishlistModal from '@/components/molecules/wishlist-modal';
import useDisclosure from '@/hooks/useDisclosure';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import toast from '@/components/atoms/toaster/helpers/toast';
import { ShoppingListCTAProps, Wishlist } from '../types';
import WishlistToast from './wishlist-toast';

const ShoppingListCTA = ({
  getWishlists,
  addToWishlists,
  removeFromWishlists,
  addToNewWishlist,
}: ShoppingListCTAProps) => {
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

    const checkedBoxes = shoppingLists?.reduce(
      (acc, list) => {
        acc[list.id] = !!list.productIsInWishlist;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setCheckedBoxes(checkedBoxes ?? {});
  }, [getWishlists]);

  const toastAddedLists = (addedWishlists: string[]) => {
    addedWishlists.forEach((addedWishlistsId) => {
      const wishlist = lists.find((list) => list.id === addedWishlistsId);

      if (wishlist) {
        toast.render(<WishlistToast wishlist={wishlist} />, 'success', { position: 'top-right' });
      }
    });
  };

  const handleSubmit = async () => {
    const addedWishlists: string[] = [];
    const removedWishlists: { wishlistId: string; lineItemId: string }[] = [];

    lists.forEach((list) => {
      if (checkedBoxes[list.id] && !list.productIsInWishlist) {
        addedWishlists.push(list.id);
      } else if (!checkedBoxes[list.id] && list.productIsInWishlist) {
        removedWishlists.push({ lineItemId: list.lineItemId ?? '', wishlistId: list.id });
      }
    });

    if (addedWishlists.length) {
      await addToWishlists(addedWishlists);
    }

    if (removedWishlists.length) {
      await removeFromWishlists(removedWishlists);
    }

    if (addedWishlists.length) {
      toastAddedLists(addedWishlists);
    }

    onClose();
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
