import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';
import { Associate } from '@/types/entity/associate';
import { BusinessUnit } from '@/types/entity/business-unit';

export interface BusinessUnitPayload extends BusinessUnit {
  createStore?: boolean;
}

export interface CompanyAdminPageProps {
  businessUnitOptions: Option[];
  countryOptions: (Option & { states: Option[] })[];
  roleOptions: Option[];
  initialBusinessUnit?: string;
  companyName?: string;
  storeName?: string;
  addressesAreViewOnly?: boolean;
  businessUnitsAreViewOnly?: boolean;
  associatesAreViewOnly?: boolean;
  onBusinessUnitChange?: (businessUnit: string) => void;
  generalInformation: BusinessUnit[];
  addresses: Address[];
  accountAddresses: Address[];
  associates: Associate[];
  businessUnits: BusinessUnit[];
  canAddBusinessUnit?: boolean;
  onUpdateGeneralInfo?: (info: Partial<BusinessUnit>) => Promise<boolean>;
  onAddAddress?: (address: Address) => Promise<boolean>;
  onUpdateAddress?: (address: Partial<Address>) => Promise<boolean>;
  onDeleteAddress?: (id: string) => Promise<boolean>;
  onAddAccountAddress?: (address: Address) => Promise<boolean>;
  onUpdateAccountAddress?: (address: Partial<Address>) => Promise<boolean>;
  onDeleteAccountAddress?: (id: string) => Promise<boolean>;
  onAddAssociate?: (associate: Associate) => Promise<boolean>;
  onUpdateAssociate?: (associate: Partial<Associate>) => Promise<boolean>;
  onDeleteAssociate?: (id: string) => Promise<boolean>;
  onAddBusinessUnit?: (businessUnit: BusinessUnitPayload) => Promise<boolean>;
  onUpdateBusinessUnit?: (businessUnit: Partial<BusinessUnitPayload>) => Promise<boolean>;
  onSearchAddresses?: (val: string) => void;
  onSearchAccountAddresses?: (val: string) => void;
  onSearchAssociates?: (val: string) => void;
  onSearchBusinessUnits?: (val: string) => void;
}
