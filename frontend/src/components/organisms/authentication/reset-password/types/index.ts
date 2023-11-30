import { UseAccountReturn } from '@/lib/hooks/useAccount/types';
import { AuthLayoutProps } from '../../types';

export type ResetPasswordProps = AuthLayoutProps & {
  resetPassword: UseAccountReturn['resetPassword'];
};

export type ResetPasswordData = { password: string; confirmPassword: string };
