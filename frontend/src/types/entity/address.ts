export interface Address {
  id: string;
  name?: string;
  careOf?: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  phone?: string;
  zip?: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}
