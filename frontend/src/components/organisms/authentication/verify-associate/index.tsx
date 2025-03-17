import { ChangeEvent, useState } from 'react';
import { useTranslations } from 'use-intl';
import { InputProps } from '@/components/atoms/input/types';
import toast from '@/components/atoms/toaster/helpers/toast';
import useCustomRouter from '@/hooks/useCustomRouter';
import PasswordInput from '@/components/atoms/password-input';
import Input from '@/components/atoms/input';
import useValidate from '@/hooks/useValidate/useValidate';
import AuthForm from '../layouts/auth-form';
import AuthLayout from '../layouts/auth-layout';
import { VerifyAssociateInput, VerifyAssociateProps } from './types';

const VerifyAssociate = ({ image, logo, logoLink, company, onSubmit }: VerifyAssociateProps) => {
  const translate = useTranslations();
  const router = useCustomRouter();

  const { validatePassword } = useValidate();

  const [passwordError, setPasswordError] = useState('');
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });

  const inputArray = [
    { label: translate('common.firstName'), name: 'firstName' },
    { label: translate('common.lastName'), name: 'lastName' },
  ];

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    if (name === 'password' && passwordError) setPasswordError('');
    setData({ ...data, [name]: value });
  };

  const commonProps: InputProps = {
    onChange: (e) => handleChange(e),
    containerClassName: 'w-full',
    className: 'w-full',
  };

  const handleOnSubmit = () => {
    const isValidPassword = validatePassword(data.password);
    if (!isValidPassword) {
      setPasswordError(translate('error.password-not-valid'));
      return;
    }

    onSubmit(data)
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        toast.error(translate('error.wentWrong'));
      });
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        title={translate('account.account-join-title', {
          company,
        })}
        subtitle={translate('account.account-join-subtitle', {
          company,
        })}
        buttonLabel={translate('account.account-register')}
        footerLabel={translate('account.by-registering')}
        footerLink="/"
        footerLinkLabel={translate('account.terms-of-use')}
        onSubmit={handleOnSubmit}
      >
        {inputArray.map(({ label, name }) => (
          <Input
            key={name}
            name={name}
            value={data[name as keyof Omit<VerifyAssociateInput, 'password'>]}
            required
            label={label}
            {...commonProps}
          />
        ))}
        <PasswordInput
          name="password"
          value={data.password}
          error={passwordError}
          required
          label={translate('account.password')}
          {...commonProps}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default VerifyAssociate;
