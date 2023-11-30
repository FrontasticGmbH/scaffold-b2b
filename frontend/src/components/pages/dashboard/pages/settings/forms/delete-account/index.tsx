import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import { Props } from './types';

const DeleteAccountForm = ({ onCancel, onDeleteAccount }: Props) => {
  const { translate } = useTranslation();

  const router = useRouter();

  const [data, setData] = useState({ password: '' });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);

      const success = await onDeleteAccount?.(data.password);

      if (success) router.push('/login');
      else {
        toast.error(translate('dashboard.failed.to.delete.account'), {
          position: 'top-right',
        });
      }

      setIsLoading(false);
    },
    [onDeleteAccount, data, router, translate],
  );

  const isDisabled = !data.password;

  return (
    <form onSubmit={handleSubmit}>
      <p className="pb-4 text-14 text-gray-700">{translate('dashboard.cannot.regain.access')}</p>

      <PasswordInput
        containerClassName="w-[370px]"
        name="password"
        label={translate('dashboard.password.confirmation')}
        required
        value={data.password}
        onChange={handleChange}
      />

      <div className="flex items-center gap-3 pt-6">
        <Button variant="secondary" size="m" onClick={onCancel} type="button" className="min-w-[112px]">
          {translate('common.cancel')}
        </Button>
        <Button
          variant="warning"
          size="m"
          type="submit"
          disabled={isDisabled}
          loading={isLoading}
          className="min-w-[112px]"
        >
          {translate('common.delete')}
        </Button>
      </div>
    </form>
  );
};

export default DeleteAccountForm;
