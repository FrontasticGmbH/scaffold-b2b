import { UseAccountReturn } from '@/lib/hooks/useAccount/types';
import { AuthLayoutProps, AuthTemplatesProps } from '../../types';

export type LoginProps = AuthLayoutProps & {
  login: UseAccountReturn['login'];
  requestPasswordReset: UseAccountReturn['requestPasswordReset'];
};

export type UseAuthProps = (
  props: AuthLayoutProps & {
    resetting: boolean;
    handleLoginSubmit: () => void;
    handleResetSubmit: () => void;
    goBackToLogin: () => void;
  },
) => AuthTemplatesProps;
