import { Attribute as EntityAttribute } from '@/types/entity/product';
import { Attributes } from '@shared/types/product';

export const mapAttribute = (attribute?: Attributes): EntityAttribute => {
  return {
    label: attribute?.label,
    value: attribute?.key,
  };
};
