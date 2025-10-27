import { useMemo } from 'react';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { ListWishListsProps } from '@/components/molecules/wishlist-modal/types';
import { TrashIcon } from '@heroicons/react/24/outline';

const ListWishlist = ({
  lists,
  selectedIds,
  savedItemsIds,
  onClose,
  onSubmit,
  handleChange,
  loading,
}: ListWishListsProps) => {
  const translate = useTranslations();

  const isConfirmDisabled = useMemo(() => {
    if (!savedItemsIds) return false;
    if (savedItemsIds.length !== selectedIds.length) return false;
    const set = new Set(savedItemsIds);
    return selectedIds.every((id) => set.has(id));
  }, [savedItemsIds, selectedIds]);

  const toggleAdd = (id: string, checked: boolean) => {
    handleChange(id, checked);
  };
  const handleRemove = (id: string) => {
    handleChange(id, false);
  };

  return (
    <>
      <div className="px-6 lg:pl-0 lg:pr-5">
        <p className="border-b border-neutral-400 pb-6 pt-4 text-16 font-semibold leading-loose text-gray-700 md:pt-6 md:text-20 lg:mx-auto lg:max-w-[400px]">
          {translate('wishlist.select-list')}
        </p>
      </div>
      <div className="lg:pr-5">
        <div className="custom-scrollbar max-h-[284px] overflow-y-scroll px-6 lg:px-0">
          <div className="lg:mx-auto lg:max-w-[400px]">
            {lists?.map(({ label, id }, index) => {
              const isMember = selectedIds.includes(id);

              return (
                <div
                  key={id}
                  className={classnames(
                    'ml-2 flex w-full items-center justify-between border-neutral-400 py-4 lg:py-5',
                    {
                      'border-b': index < lists.length - 1,
                    },
                  )}
                  data-testid={`list-row-${label}`}
                >
                  <span className="text-gray-700">{label}</span>

                  {isMember ? (
                    <Button
                      size="s"
                      variant="warning"
                      Icon={TrashIcon}
                      iconPosition="left"
                      onClick={() => handleRemove(id)}
                      aria-label={translate('wishlist.modal-checkbox-remove')}
                      data-testid={`add-to-list-${id}`}
                    >
                      {translate('wishlist.modal-checkbox-remove')}
                    </Button>
                  ) : (
                    <Button
                      size="s"
                      variant="secondary"
                      onClick={() => toggleAdd(id, true)}
                      aria-label={translate('common.add')}
                      data-testid={`add-to-list-${id}`}
                    >
                      {translate('common.add')}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-auto border-t border-neutral-400 p-6">
        <div className="flex justify-end gap-3 lg:mx-auto lg:max-w-[400px]">
          <Button size="m" variant="secondary" onClick={onClose} data-testid="submit">
            {translate('common.cancel')}
          </Button>
          <Button
            loading={loading}
            size="m"
            onClick={() => onSubmit(lists)}
            data-testid="confirm"
            disabled={isConfirmDisabled}
          >
            {translate('wishlist.modal-cta-update')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ListWishlist;
