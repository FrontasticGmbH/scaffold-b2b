import { ChangeEvent, FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import { InputProps } from '@/components/atoms/input/types';
import { Account } from '@shared/types/account/Account';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import AuthLayout from '../layouts/auth-layout';
import { RegisterProps } from './types';
import AuthForm from '../layouts/auth-form';

const Register: FC<RegisterProps> = ({ image, logo, logoLink, register, login }) => {
  const { translate } = useTranslation();

  const [data, setData] = useState<Account>({});

  const router = useRouter();

  const inputArray = [
    { label: translate('common.emailAddress'), name: 'email' },
    { label: translate('common.companyName'), name: 'companyName' },
    { label: translate('common.firstName'), name: 'firstName' },
    { label: translate('common.lastName'), name: 'lastName' },
  ];

  const commonProps: InputProps = {
    onChange: (e) => handleChange(e),
    containerClassName: 'w-full',
    className: 'w-full',
  };

  const handleSubmit = () => {
    if (data.email && data.password && data.companyName) {
      register(data)
        .then(() => {
          data.email && data.password && login(data.email, data.password).then(() => router.push('/'));
        })
        .catch(() => {
          toast.error(translate('account.account.create.fail'));
        });
    }
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setData({ ...data, [name]: value });
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm
        onSubmit={handleSubmit}
        title={translate('account.account.register.new')}
        subtitle={translate('account.account.alreadyHave')}
        subtitleLink="/login"
        subtitleLinkLabel={translate('account.account.login')}
        footerLabel={translate('account.by.registering')}
        footerLink="/"
        footerLinkLabel={translate('account.terms.of.use')}
        buttonLabel={translate('account.account.register')}
      >
        {inputArray.map(({ label, name }) => (
          <Input
            key={name}
            name={name}
            value={(data[name as keyof Account] as string) ?? ''}
            required
            label={label}
            {...commonProps}
          />
        ))}
        <PasswordInput
          name="password"
          value={data.password ?? ''}
          label={`${translate('account.password')} *`}
          onChange={handleChange}
          {...commonProps}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
