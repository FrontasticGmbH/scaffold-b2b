import React, { useCallback, useState } from 'react';
import Button from '@/components/atoms/button';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import PasswordInput from '@/components/atoms/password-input';
// import useValidate from '@/hooks/useValidate/useValidate';
import { Props } from './types';

const ChangePasswordForm = ({ onCancel, onChangePassword }: Props) => {
  const { translate } = useTranslation();

  // const { validatePassword } = useValidate();

  const [data, setData] = useState({ oldPassword: '', newPassword: '', confirmedNewPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === 'newPassword' && passwordError) setPasswordError('');
      setData({ ...data, [e.target.name]: e.target.value });
    },
    [data, passwordError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      //TODO: Need to discuss, there are no restrictions on signup
      // const isValidPassword = validatePassword(data.newPassword);
      // if (!isValidPassword) {
      //   setPasswordError(translate('error.password.not.valid'));
      //   setIsLoading(false);
      //   return;
      // }

      await onChangePassword?.(data.oldPassword, data.newPassword);
      setData({ oldPassword: '', newPassword: '', confirmedNewPassword: '' });
      setIsLoading(false);
    },
    [data.newPassword, data.oldPassword, onChangePassword],
  );

  const isDisabled =
    !data.oldPassword ||
    !data.newPassword ||
    !data.confirmedNewPassword ||
    data.confirmedNewPassword !== data.newPassword;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <PasswordInput
          containerClassName="w-[370px]"
          name="oldPassword"
          label={translate('dashboard.current.password')}
          required
          value={data.oldPassword}
          onChange={handleChange}
        />

        <PasswordInput
          containerClassName="w-[370px]"
          name="newPassword"
          label={translate('dashboard.new.password')}
          required
          value={data.newPassword}
          error={passwordError}
          onChange={handleChange}
        />

        <PasswordInput
          containerClassName="w-[370px]"
          name="confirmedNewPassword"
          label={translate('dashboard.confirm.password')}
          required
          value={data.confirmedNewPassword}
          onChange={handleChange}
          error={
            data.newPassword && data.confirmedNewPassword && data.newPassword !== data.confirmedNewPassword
              ? translate('dashboard.password.not.match')
              : ''
          }
        />
      </div>

      <div className="flex items-center gap-3 pt-6">
        <Button variant="secondary" size="m" onClick={onCancel} type="button" className="min-w-[112px]">
          {translate('common.cancel')}
        </Button>
        <Button
          variant="primary"
          size="m"
          type="submit"
          disabled={isDisabled}
          loading={isLoading}
          className="min-w-[112px]"
        >
          {translate('common.save')}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
