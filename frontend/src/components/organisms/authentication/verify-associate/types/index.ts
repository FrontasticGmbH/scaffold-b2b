import { Account } from '@shared/types/account';
import { AuthLayoutProps } from '../../types';

export type VerifyAssociateInput = {
  firstName: string;
  lastName: string;
  password: string;
};

export type onSubmitVerifyAssociate = (args: VerifyAssociateInput) => Promise<Account>;

export type VerifyAssociateProps = AuthLayoutProps & {
  company: string;
  onSubmit: onSubmitVerifyAssociate;
};
