import { Reference } from '@/types/lib/reference';

export interface Props {
  termsAndConditionsLink: Reference;
  enableCtCheckout: boolean;
  callbackUrl: string;
}
