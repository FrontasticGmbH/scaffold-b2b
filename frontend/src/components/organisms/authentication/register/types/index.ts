import { UseAccountReturn } from '@/lib/hooks/useAccount/types';
import { AuthLayoutProps } from '../../types';

export type RegisterProps = AuthLayoutProps & {
  register: UseAccountReturn['register'];
  login: UseAccountReturn['login'];
};
