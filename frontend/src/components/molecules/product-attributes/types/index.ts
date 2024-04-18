import { Attribute } from '@/types/entity/product';

export type ProductAttributeProps = {
  attribute: Attribute;
};

export type ProductAttributesProps = {
  className?: string;
  attributes: Attribute[];
};
