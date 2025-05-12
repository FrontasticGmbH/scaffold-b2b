import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCustomRouter from '@/hooks/useCustomRouter';
import Button from '@/components/atoms/button';
import { useTranslations } from 'use-intl';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import Confirmation from '@/components/organisms/confirmation';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { Props } from './types';

type FormData = {
  password: string;
};

const DeleteAccountForm = ({ onCancel, onDeleteAccount }: Props) => {
  const translate = useTranslations();

  const router = useCustomRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { selectedBusinessUnit } = useStoreAndBusinessUnits();
  const isLastAssociate = selectedBusinessUnit?.associates?.length === 1;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { password: '' },
  });

  const onSubmit = async (data: FormData) => {
    const success = await onDeleteAccount?.(data.password);
    if (success === true) {
      router.push('/login');
    } else {
      toast.error(translate('dashboard.failed-to-delete-account'), {
        position: 'top-right',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="pb-4 text-14 text-gray-700">{translate('dashboard.cannot-regain-access')}</p>

      <PasswordInput
        containerClassName="w-[370px]"
        label={translate('dashboard.password-confirmation')}
        required
        {...register('password', { required: true })}
        error={errors.password?.message}
      />

      <div className="flex items-center gap-3 pt-6">
        <Button variant="secondary" size="m" onClick={onCancel} type="button" className="min-w-[112px]">
          {translate('common.cancel')}
        </Button>

        <Confirmation
          translations={{
            title: translate('account.delete-account'),
            summary: translate(
              isLastAssociate ? 'dashboard.associate-delete-disabled' : 'dashboard.cannot-regain-access',
            ),
            cancel: translate('common.cancel'),
            confirm: translate('common.delete'),
          }}
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          disabled={isLastAssociate}
          onConfirm={handleSubmit(onSubmit)}
        >
          <Button
            variant="warning"
            size="m"
            type="button"
            disabled={!isValid}
            loading={isSubmitting}
            onClick={() => setIsOpen(true)}
            className="min-w-[112px]"
          >
            {translate('common.delete')}
          </Button>
        </Confirmation>
      </div>
    </form>
  );
};

export default DeleteAccountForm;
