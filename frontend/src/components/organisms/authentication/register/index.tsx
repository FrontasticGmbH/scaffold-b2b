import { ChangeEvent, useState } from 'react';
import useCustomRouter from '@/hooks/useCustomRouter';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import { InputProps } from '@/components/atoms/input/types';
import { Account } from '@shared/types/account/Account';
import { useTranslations } from 'use-intl';
import { namePattern } from '@/constants/regex';
import useValidate from '@/hooks/useValidate/useValidate';
import AuthLayout from '../layouts/auth-layout';
import { RegisterProps } from './types';
import AuthForm from '../layouts/auth-form';
import useAuthProps from './hooks/useAuthProps';

const Register = ({ image, logo, logoLink, register }: RegisterProps) => {
  const translate = useTranslations();

  const router = useCustomRouter();

  const { validatePassword } = useValidate();

  const [data, setData] = useState<Account>({});
  const [errors, setErrors] = useState<Account>({});
  const [confirmed, setConfirmed] = useState(false);
  const nameValidation = { pattern: namePattern, title: translate('common.name-validation') };

  const inputArray: Array<InputProps> = [
    {
      label: translate('common.emailAddress'),
      name: 'email',
    },
    { label: translate('common.companyName'), name: 'companyName' },
    {
      label: translate('common.firstName'),
      name: 'firstName',
      ...nameValidation,
    },
    {
      label: translate('common.lastName'),
      name: 'lastName',
      ...nameValidation,
    },
  ];

  const commonProps: InputProps = {
    onChange: (e) => handleChange(e),
    containerClassName: 'w-full',
    className: 'w-full',
  };

  const handleSubmit = () => {
    const noEmptyFields = data.email && data.password && data.companyName;

    if (noEmptyFields) {
      const isValidPassword = data.password && validatePassword(data.password);

      if (!isValidPassword) {
        setErrors({ password: translate('error.password-not-valid') });
        return;
      }

      register(data)
        .then(() => {
          setConfirmed(true);
        })
        .catch((err) => {
          if (err.message.includes('409')) {
            if (err.message.includes('account')) {
              setErrors({ email: translate('error.email-exists') });
            } else if (err.message.includes('company')) {
              setErrors({ companyName: translate('error.company-exists') });
            }
          } else toast.error(translate('error.account-create-fail'));
        });
    }
  };

  const handleRedirect = () => {
    router.push('/login');
  };

  const authProps = useAuthProps({
    confirmed,
    handleSubmitRegister: handleSubmit,
    handleLoginRedirect: handleRedirect,
  });

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setData({ ...data, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm {...authProps}>
        {confirmed ? (
          <div>
            <p className="inline text-16 leading-loose text-gray-600">{translate('account.verification-sent')}</p>
            <p className="inline text-16 font-medium leading-loose text-gray-600">{` ${data.email}. `}</p>
            <p className="inline text-16 leading-loose text-gray-600">{translate('account.verification-login')}</p>
          </div>
        ) : (
          <>
            {inputArray.map(({ label, name, pattern, title }) => (
              <Input
                key={name}
                name={name}
                value={(data[name as keyof Account] as string) ?? ''}
                error={(errors[name as keyof Account] as string) ?? ''}
                required
                pattern={pattern}
                title={title}
                type={name === 'email' ? 'email' : 'text'}
                label={label}
                {...commonProps}
              />
            ))}
            <PasswordInput
              name="password"
              value={data.password ?? ''}
              error={errors['password']}
              label={translate('account.password')}
              onChange={handleChange}
              required
              {...commonProps}
            />
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
