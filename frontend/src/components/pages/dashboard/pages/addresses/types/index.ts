import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';

export interface AddressesPageProps {
  accountAddresses: Address[];
  onAddAccountAddress?: (address: Address) => Promise<void>;
  onDeleteAccountAddress?: (id: string) => Promise<void>;
  onUpdateAccountAddress?: (address: Partial<Address>) => Promise<void>;
  onSearchAccountAddresses?: (val: string) => void;
  countryOptions: Array<Option & { states: Array<Option> }>;
}
