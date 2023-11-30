import { useState } from 'react';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import ResponsiveModal from '@/components/organisms/responsive-modal';
import Checkbox from '@/components/atoms/checkbox';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import { classnames } from '@/utils/classnames/classnames';
import { MoveToListProps } from './types';

const MoveToList = ({ lists }: MoveToListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { translate } = useTranslation();

  const [checkedBoxes, setCheckedBoxes] = useState<Record<string, boolean>>({});

  const selectedIds = Object.keys(checkedBoxes).filter((key) => !!checkedBoxes[key]);

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
        className="flex-1 text-center text-14 font-medium text-gray-700 md:flex-[unset] md:text-start"
        onClick={onOpen}
      >
        {translate('wishlist.move.to.list')}
      </Button>
      <ResponsiveModal isOpen={isOpen} onRequestClose={onClose} closeButton className="md:w-[400px] lg:w-[600px]">
        <div className="px-6 lg:pl-0 lg:pr-5">
          <Typography
            fontWeight="semibold"
            fontSize={16}
            lineHeight="loose"
            className="border-b border-neutral-400 pb-6 pt-4 text-gray-700 md:pt-6 md:text-20 lg:mx-auto lg:max-w-[400px]"
          >
            {translate('wishlist.select.list')}
          </Typography>
        </div>

        <div className="lg:pr-5">
          <div className="custom-scrollbar max-h-[284px] overflow-y-scroll px-6 lg:px-0">
            <div className="lg:mx-auto lg:max-w-[400px]">
              <div className="" />
              {lists.map(({ label, id }, index) => (
                <Checkbox
                  key={id}
                  label={label}
                  value={id}
                  onChecked={(checked) => handleChange(id, checked)}
                  containerClassName={classnames(
                    'w-full flex-row-reverse justify-between border-neutral-400 py-4 lg:py-5',
                    { 'border-b': index < lists.length - 1 },
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-400 p-6">
          <div className="flex justify-end gap-3 lg:mx-auto lg:max-w-[400px]">
            <Button size="m" variant="secondary" onClick={onClose}>
              {translate('common.cancel')}
            </Button>
            <Button size="m" onClick={onClose} disabled={selectedIds.length === 0}>
              {translate('wishlist.move')}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </>
  );
};

export default MoveToList;
