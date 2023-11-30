import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';

export interface AddressesPageProps {
  accountAddresses: Address[];
  onAddAccountAddress?: (address: Address) => Promise<boolean>;
  onDeleteAccountAddress?: (id: string) => Promise<boolean>;
  onUpdateAccountAddress?: (address: Partial<Address>) => Promise<boolean>;
  onSearchAccountAddresses?: (val: string) => void;
  countryOptions: Array<Option & { states: Array<Option> }>;
}
