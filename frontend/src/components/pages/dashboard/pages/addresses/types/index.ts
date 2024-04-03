import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';

export interface AddressesPageProps {
  addresses: Address[];
  viewOnly?: boolean;
  onAddAddress?: (address: Address) => Promise<boolean>;
  onDeleteAddress?: (id: string) => Promise<boolean>;
  onUpdateAddress?: (address: Partial<Address>) => Promise<boolean>;
  onSearchAddresses?: (val: string) => void;
  countryOptions: Array<Option & { states: Array<Option> }>;
}
