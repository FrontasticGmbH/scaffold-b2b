import { Attribute } from '@/types/entity/product';
import { Variant } from '@shared/types/product/Variant';
import { Facet } from '@shared/types/result';
import { StringHelpers } from '../string-herlpers';

type InputObject = { [key: string]: string | boolean | { key: string; value: string } };
type OutputArray = Attribute[];

function modifyLabel(key: string): string {
  const shortKey = key.split('.').pop() ?? key;

  // ISO-style (like iso45001 → ISO45001)
  if (/^iso\d+/i.test(shortKey)) {
    return shortKey.toUpperCase();
  }
  return StringHelpers.capitaliseFirstLetter(shortKey);
}

function getFacetLabelByAttributeKey(attributeKey: string, facets?: Facet[]): string {
  const facetLabel = facets?.find((f) => f.identifier === attributeKey)?.label;
  return facetLabel ?? modifyLabel(attributeKey);
}

export const mapMasterAttributes = (variant: Variant, facets?: Facet[]): OutputArray => {
  const masterAttributes = { ...variant.attributes } as InputObject;

  return Object.entries(masterAttributes)
    .filter(([key]) => key !== 'variants.attributes.relatedProducts')
    .map(([key, value]) => {
      const label = getFacetLabelByAttributeKey(key, facets);

      if (key.toLowerCase().includes('iso')) {
        return {
          label,
          value: value === 'true' ? 'Certified' : 'Not Certified',
        };
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return { label, value: value.key };
      }

      return { label, value: value.toString() };
    });
};
