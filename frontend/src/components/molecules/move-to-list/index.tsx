import { useState } from 'react';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import Checkbox from '@/components/atoms/checkbox';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import { MoveToListProps } from './types';

const MoveToList = ({ lists }: MoveToListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { translate } = useTranslation();

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});

  const handleChange = (id: string, checked: boolean) => {
    const updated = { ...checkedBoxes };
    updated[id] = checked;

    setCheckedBoxes(updated);
  };

  return (
    <>
      <Button
        size="fit"
        variant="ghost"
        className="grow text-center text-14 font-medium md:grow-0 md:text-start"
        onClick={onOpen}
      >
        {translate('wishlist.move.to.list')}
      </Button>
      <ResponsiveModal isOpen={isOpen} onRequestClose={onClose} closeButton className="md:w-[400px] lg:w-[600px]">
        <div className="px-6 pt-6 lg:mx-auto lg:max-w-[400px]">
          <Typography fontWeight="semibold" fontSize={16} lineHeight="loose" className="pb-4 text-gray-700 md:text-20">
            {translate('wishlist.select.list')}
          </Typography>

          <div className="max-h-[284px] overflow-y-scroll">
            {lists.map(({ label, id }) => (
              <Checkbox
                key={id}
                label={label}
                value={id}
                onChecked={(checked) => handleChange(id, checked)}
                containerClassName="flex-row-reverse w-full justify-between py-4 lg:py-5 border-y border-neutral-400"
              />
            ))}
          </div>
        </div>

        <div className=" border-t border-neutral-400 p-6">
          <div className="flex justify-end gap-3 lg:mx-auto lg:max-w-[400px]">
            <Button size="l" variant="secondary" onClick={onClose}>
              {translate('common.cancel')}
            </Button>
            <Button size="l" onClick={onClose}>
              {translate('wishlist.move')}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </>
  );
};

export default MoveToList;
