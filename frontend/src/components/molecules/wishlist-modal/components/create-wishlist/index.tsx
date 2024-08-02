import { Fragment, useCallback, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useEntityToasters from '@/hooks/useEntityToasters';
import { PurchaseList } from '@/types/entity/purchase-list';
import EntityForm from '@/components/organisms/entity-form';
import Input from '@/components/atoms/input';
import TextArea from '@/components/atoms/text-area';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import Typography from '@/components/atoms/typography';
import { AddToNewWishlistProps } from '@/components/molecules/wishlist-modal/types';

const CreateWishlist = ({ onAddToNewList, onClose }: AddToNewWishlistProps) => {
  const { translate } = useTranslation();

  const { showFailedMessage } = useEntityToasters('purchaselist');
  const { selectedStore } = useStoreAndBusinessUnits();
  const [data, setData] = useState<Partial<PurchaseList>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(async () => {
    try {
      await onAddToNewList?.({ ...(data as PurchaseList), store: selectedStore });
      onClose();
    } catch {
      showFailedMessage();
    }
  }, [onAddToNewList, data, selectedStore, onClose, showFailedMessage]);

  return (
    <Fragment>
      <div className="px-6 lg:pl-0 lg:pr-5">
        <Typography
          fontWeight="semibold"
          fontSize={16}
          lineHeight="loose"
          className="pt-4 text-gray-700 md:pt-6 md:text-20 lg:mx-auto lg:max-w-[400px]"
        >
          {translate('product.add.to.new.list')}
        </Typography>
      </div>
      <EntityForm
        classNames={{
          form: 'w-fit m-auto border-none',
          buttonsContainer: 'border-t border-neutral-400 mt-8 pt-5 justify-end',
        }}
        translations={{ cancel: translate('common.cancel'), submit: translate('product.save.and.add') }}
        onSubmit={handleSubmit}
        onCancel={onClose}
      >
        <div className="m-auto flex w-fit flex-col gap-4">
          <Input
            name="name"
            label={translate('common.name')}
            required
            value={data.name ?? ''}
            onChange={handleChange}
            containerClassName="md:w-[350px] lg:w-[400px]"
          />
          <TextArea
            name="description"
            label={translate('common.description')}
            showOptionalLabel
            value={data.description}
            onChange={handleChange}
            className="h-[160px] md:w-[350px] lg:w-[400px]"
          />
        </div>
      </EntityForm>
    </Fragment>
  );
};

export default CreateWishlist;
