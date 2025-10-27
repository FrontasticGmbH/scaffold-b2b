import { useCallback, useMemo, useRef, useState } from 'react';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import useDisclosure from '@/hooks/useDisclosure';
import { MoveToListProps } from './types';
import WishlistModal from '../wishlist-modal';
import { Wishlist } from '../wishlist-modal/types';

const MoveToList = ({ lists, onSubmit, onAddNewList, disabled }: MoveToListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openSnapshotRef = useRef<Record<string, boolean> | null>(null);

  const [loading, setLoading] = useState(false);

  const translate = useTranslations();

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(() => Object.keys(checkedBoxes).filter((key) => !!checkedBoxes[key]), [checkedBoxes]);
  const handleChange = (id: string, checked: boolean) => {
    const updated = { ...checkedBoxes };
    updated[id] = checked;
    setCheckedBoxes(updated);
  };

  const handleSubmit = useCallback(
    async (lists: Wishlist[]) => {
      setLoading(true);

      await onSubmit?.(lists.filter((list) => selectedIds.includes(list.id)).map((list) => list.id));

      onClose();

      setLoading(false);
    },
    [onSubmit, onClose, selectedIds],
  );

  const handleCancelClose = () => {
    if (openSnapshotRef.current) {
      setCheckedBoxes(openSnapshotRef.current);
    }
    openSnapshotRef.current = null;
    onClose();
  };

  const savedItemsIds = useMemo(() => {
    const snap = openSnapshotRef.current || {};
    return Object.keys(snap).filter((k) => !!snap[k]);
  }, []);

  return (
    <>
      <Button
        size="fit"
        variant="ghost"
        className="flex-1 text-center text-14 font-medium text-gray-700 md:flex-[unset] md:text-start"
        onClick={() => {
          openSnapshotRef.current = { ...checkedBoxes };
          onOpen();
        }}
        disabled={disabled}
      >
        {translate('wishlist.move-to-list')}
      </Button>
      <WishlistModal
        lists={lists}
        isOpen={isOpen}
        onClose={handleCancelClose}
        handleChange={handleChange}
        selectedIds={selectedIds}
        savedItemsIds={savedItemsIds}
        onSubmit={handleSubmit}
        loading={loading}
        onAddToNewList={onAddNewList}
      />
    </>
  );
};

export default MoveToList;
