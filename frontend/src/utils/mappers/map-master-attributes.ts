import { Attribute } from '@/types/entity/product';
import { Variant } from '@shared/types/product/Variant';

type InputObject = { [key: string]: string | boolean | { key: string; value: string } };
type OutputArray = Attribute[];

export const mapMasterAttributes = (variant: Variant): OutputArray => {
  const masterAttributes = { ...variant.attributes } as InputObject;
  delete masterAttributes.relatedProducts;

  return Object.entries(masterAttributes).map(([key, value]) => {
    // Check if the value is an object (but not an array or null)
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Assuming the object has a 'key' property, adjust if necessary
      return { label: key, value: value.key };
    }
    // Convert other types of values to strings directly
    return { label: key, value: value.toString() };
  });
};
