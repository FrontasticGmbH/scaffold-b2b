import { AuthLayoutProps } from '@/components/organisms/authentication/types';
import { TasticProps } from '@/lib/tastics/types';

export type VerifyAssociateTasticProps = TasticProps<
  AuthLayoutProps & {
    company: string;
  }
>;
