import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { AuthFormProps } from '../../types';
import { UseAuthProps } from '../types';

const useAuthProps = ({ confirmed, handleSubmitRegister, handleLoginRedirect }: UseAuthProps) => {
  const { translate } = useTranslation();

  const authLayoutProps: { [key in 'confirmed' | 'register']: AuthFormProps } = {
    register: {
      title: translate('account.account.register.new'),
      subtitle: translate('account.account.alreadyHave'),
      subtitleLink: '/login',
      subtitleLinkLabel: translate('account.account.login'),
      footerLabel: translate('account.by.registering'),
      footerLink: '/',
      footerLinkLabel: translate('account.terms.of.use'),
      buttonLabel: translate('account.account.register'),
      onSubmit: handleSubmitRegister,
    },
    confirmed: {
      title: translate('account.register.confirmed'),
      buttonLabel: translate('account.account.login'),
      includeCheckIcon: true,
      onSubmit: handleLoginRedirect,
    },
  };

  return authLayoutProps[confirmed ? 'confirmed' : 'register'];
};

export default useAuthProps;
