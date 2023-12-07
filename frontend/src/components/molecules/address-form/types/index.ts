import { Option } from '@/components/atoms/select/types';
import { Address } from '@/types/entity/address';

export interface AddressFormProps {
  translations?: {
    submit?: string;
    cancel?: string;
  };
  toasters?: boolean;
  unstyled?: boolean;
  countryOptions: (Option & { states: Option[] })[];
  addresses: Address[];
  showPhoneField?: boolean;
  showCancelButton?: boolean;
  showSubmitButton?: boolean;
  showDefaultCheckBoxes?: boolean;
  onAddAddress?: (address: Address) => Promise<boolean>;
  onUpdateAddress?: (address: Partial<Address>) => Promise<boolean>;
  onSave?: () => void;
  onCancel?: () => void;
}
