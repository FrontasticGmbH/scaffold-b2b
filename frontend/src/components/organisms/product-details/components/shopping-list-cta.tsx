import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import WishlistModal from '@/components/molecules/wishlist-modal';
import toast from '@/components/atoms/toaster/helpers/toast';
import useDisclosure from '@/hooks/useDisclosure';
import { classnames } from '@/utils/classnames/classnames';
import { ShoppingListCTAProps, Wishlist } from '../types';
import WishlistToast from './wishlist-toast';

const ShoppingListCTA = ({
  getWishlists,
  canAddToOwnWishlist,
  canAddToOthersWishlist,
  addToWishlists,
  removeFromWishlists,
  addToNewWishlist,
  addToWishlistDisabled = false,
}: ShoppingListCTAProps) => {
  const translate = useTranslations();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [lists, setLists] = useState<Array<Wishlist>>([]);

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});
  const [savedItemsIds, setSavedItemsIds] = useState<string[]>([]);

  const selectedIds = useMemo(() => Object.keys(checkedBoxes).filter((key) => !!checkedBoxes[key]), [checkedBoxes]);

  const handleChange = (id: string, checked: boolean) => {
    const updated = { ...checkedBoxes };
    updated[id] = checked;

    setCheckedBoxes(updated);
  };

  const fetchLists = useCallback(async () => {
    const shoppingLists = ((await getWishlists()) ?? []).filter((shoppingList) =>
      shoppingList.isOwnWishlist ? canAddToOwnWishlist : canAddToOthersWishlist,
    );

    setLists(shoppingLists);

    const checkedBoxes = shoppingLists?.reduce(
      (acc, list) => {
        acc[list.id] = !!list.productIsInWishlist;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setCheckedBoxes(checkedBoxes ?? {});
    const saved = shoppingLists.filter((l) => !!l.productIsInWishlist).map((l) => l.id);
    setSavedItemsIds(saved);
  }, [canAddToOthersWishlist, canAddToOwnWishlist, getWishlists]);

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

    // Persist new baseline for savedItemsIds after successful submit
    setSavedItemsIds(selectedIds);

    onClose();
  };

  useEffect(() => {
    fetchLists();
  }, [fetchLists, getWishlists]);

  return (
    <div className="mb-1 mt-2 border-y border-neutral-400 py-5 lg:mt-4">
      <button
        disabled={addToWishlistDisabled}
        onClick={() => {
          if (addToWishlistDisabled) return;
          onOpen();
        }}
        className={classnames('text-14 leading-[16px] text-gray-700', {
          'cursor-not-allowed opacity-50': addToWishlistDisabled,
        })}
      >
        {`+ ${translate('product.add-to-list')}`}
      </button>
      <WishlistModal
        lists={lists}
        isOpen={isOpen}
        onAddToNewList={addToNewWishlist}
        onSubmit={handleSubmit}
        onClose={onClose}
        handleChange={handleChange}
        selectedIds={selectedIds}
        savedItemsIds={savedItemsIds}
      />
    </div>
  );
};

export default ShoppingListCTA;
