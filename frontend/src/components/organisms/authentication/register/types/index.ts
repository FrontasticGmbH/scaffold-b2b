import { UseAccountReturn } from '@/lib/hooks/useAccount/types';
import { AuthLayoutProps } from '../../types';

export type RegisterProps = AuthLayoutProps & {
  register: UseAccountReturn['register'];
};

export type UseAuthProps = {
  confirmed: boolean;
  handleSubmitRegister: () => void;
  handleLoginRedirect: () => void;
};
