import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/atoms/input';
import PasswordInput from '@/components/atoms/password-input';
import toast from '@/components/atoms/toaster/helpers/toast';
import { InputProps } from '@/components/atoms/input/types';
import { Account } from '@shared/types/account/Account';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '@/components/atoms/typography';
import AuthLayout from '../layouts/auth-layout';
import { RegisterProps } from './types';
import AuthForm from '../layouts/auth-form';
import useAuthProps from './hooks/useAuthProps';

const Register = ({ image, logo, logoLink, register }: RegisterProps) => {
  const { translate } = useTranslation();

  const router = useRouter();

  const [data, setData] = useState<Account>({});
  const [confirmed, setConfirmed] = useState(false);

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
          setConfirmed(true);
        })
        .catch(() => {
          toast.error(translate('account.account.create.fail'));
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
  };

  return (
    <AuthLayout image={image} logo={logo} logoLink={logoLink}>
      <AuthForm {...authProps}>
        {confirmed ? (
          <div>
            <Typography fontSize={14} className="inline text-gray-600" lineHeight="loose">
              {translate('account.verification.sent')}
            </Typography>
            <Typography fontWeight="medium" fontSize={14} className="inline text-gray-600" lineHeight="loose">
              {` ${data.email}. `}
            </Typography>
            <Typography fontSize={14} className="inline text-gray-600" lineHeight="loose">
              {translate('account.verification.login')}
            </Typography>
          </div>
        ) : (
          <>
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
          </>
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
