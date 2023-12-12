import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';
import { Associate } from '@/types/entity/associate';
import { BusinessUnit } from '@/types/entity/business-unit';

export interface BusinessUnitPayload extends BusinessUnit {
  createStore?: boolean;
}

export interface CompanyAdminPageProps {
  businessUnitOptions: Option[];
  storeOptions: Option[];
  countryOptions: (Option & { states: Option[] })[];
  roleOptions: Option[];
  initialBusinessUnit?: string;
  initialStore?: string;
  companyName?: string;
  storeName?: string;
  onBusinessUnitChange?: (businessUnit: string) => void;
  onStoreChange?: (store: string) => void;
  generalInformation: BusinessUnit[];
  addresses: Address[];
  accountAddresses: Address[];
  associates: Associate[];
  businessUnits: BusinessUnit[];
  canAddBusinessUnit?: boolean;
  onUpdateGeneralInfo?: (info: Partial<BusinessUnit>) => Promise<void>;
  onAddAddress?: (address: Address) => Promise<void>;
  onUpdateAddress?: (address: Partial<Address>) => Promise<void>;
  onDeleteAddress?: (id: string) => Promise<void>;
  onAddAccountAddress?: (address: Address) => Promise<void>;
  onUpdateAccountAddress?: (address: Partial<Address>) => Promise<void>;
  onDeleteAccountAddress?: (id: string) => Promise<void>;
  onAddAssociate?: (associate: Associate) => Promise<void>;
  onUpdateAssociate?: (associate: Partial<Associate>) => Promise<void>;
  onDeleteAssociate?: (id: string) => Promise<void>;
  onAddBusinessUnit?: (businessUnit: BusinessUnitPayload) => Promise<void>;
  onUpdateBusinessUnit?: (businessUnit: Partial<BusinessUnitPayload>) => Promise<void>;
  onDeleteBusinessUnit?: (id: string) => Promise<void>;
  onSearchAddresses?: (val: string) => void;
  onSearchAccountAddresses?: (val: string) => void;
  onSearchAssociates?: (val: string) => void;
  onSearchBusinessUnits?: (val: string) => void;
}
