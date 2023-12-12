import { Address } from '@shared/types/account/Address';

export interface CartDetails {
  account?: { email: string };
  shipping?: Address;
  billing?: Address;
}
