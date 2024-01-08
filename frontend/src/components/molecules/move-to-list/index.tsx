import { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import { MoveToListProps } from './types';
import WishlistModal from '../wishlist-modal';
import { Wishlist } from '../wishlist-modal/types';

const MoveToList = ({ lists, onSubmit }: MoveToListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const { translate } = useTranslation();

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});

  const selectedIds = Object.keys(checkedBoxes).filter((key) => !!checkedBoxes[key]);

  const handleChange = (id: string, checked: boolean) => {
    const updated = { ...checkedBoxes };
    updated[id] = checked;

    setCheckedBoxes(updated);
  };

  const handleSubmit = useCallback(
    async (lists: Wishlist[]) => {
      setLoading(true);

      await onSubmit?.(lists.map((list) => list.id));

      onClose();

      setLoading(false);
    },
    [onSubmit, onClose],
  );

  return (
    <>
      <Button
        size="fit"
        variant="ghost"
        className="flex-1 text-center text-14 font-medium text-gray-700 md:flex-[unset] md:text-start"
        onClick={onOpen}
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
      />
    </>
  );
};

export default MoveToList;
