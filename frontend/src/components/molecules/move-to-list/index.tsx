import { useCallback, useMemo, useState } from 'react';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import { MoveToListProps } from './types';
import WishlistModal from '../wishlist-modal';
import { Wishlist } from '../wishlist-modal/types';

const MoveToList = ({ lists, onSubmit, onAddNewList, disabled }: MoveToListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const { translate } = useTranslation();

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

  return (
    <>
      <Button
        size="fit"
        variant="ghost"
        className="flex-1 text-center text-14 font-medium text-gray-700 md:flex-[unset] md:text-start"
        onClick={onOpen}
        disabled={disabled}
      >
        {translate('wishlist.move.to.list')}
      </Button>
      <WishlistModal
        lists={lists}
        isOpen={isOpen}
        onClose={onClose}
        handleChange={handleChange}
        selectedIds={selectedIds}
        onSubmit={handleSubmit}
        loading={loading}
        onAddToNewList={onAddNewList}
      />
    </>
  );
};

export default MoveToList;
