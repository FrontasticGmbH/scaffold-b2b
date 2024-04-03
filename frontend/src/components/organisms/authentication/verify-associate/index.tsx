import { ChangeEvent, useState } from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { InputProps } from '@/components/atoms/input/types';
import toast from '@/components/atoms/toaster/helpers/toast';
import useCustomRouter from '@/hooks/useCustomRouter';
import PasswordInput from '@/components/atoms/password-input';
import Input from '@/components/atoms/input';
import AuthForm from '../layouts/auth-form';
import AuthLayout from '../layouts/auth-layout';
import { VerifyAssociateInput, VerifyAssociateProps } from './types';

const VerifyAssociate = ({ image, logo, logoLink, company, onSubmit }: VerifyAssociateProps) => {
  const { translate } = useTranslation();
  const router = useCustomRouter();

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
    setData({ ...data, [name]: value });
  };

  const commonProps: InputProps = {
    onChange: (e) => handleChange(e),
    containerClassName: 'w-full',
    className: 'w-full',
  };

  const handleOnSubmit = () => {
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
        title={translate('account.account.join.title', {
          values: { company },
        })}
        subtitle={translate('account.account.join.subtitle', {
          values: { company },
        })}
        buttonLabel={translate('account.account.register')}
        footerLabel={translate('account.by.registering')}
        footerLink="/"
        footerLinkLabel={translate('account.terms.of.use')}
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
          required
          label={translate('account.password')}
          {...commonProps}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default VerifyAssociate;
