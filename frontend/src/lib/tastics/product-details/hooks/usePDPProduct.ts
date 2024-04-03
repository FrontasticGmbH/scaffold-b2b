import { useCallback, useMemo, useState } from 'react';
import { mapProduct } from '@/utils/mappers/map-product';
import { Product as SharedProduct } from '@shared/types/product';
import { mapAttribute } from '@/utils/mappers/map-attribute';

const usePDPProduct = (product: SharedProduct) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  const onChangeVariant = useCallback(
    (variant: 'color' | 'model', value: string) => {
      const updatedVariantIdx = product.variants.findIndex((v) =>
        v.attributes?.[variant].key ? v.attributes?.[variant].key === value : v.attributes?.[variant] === value,
      );
      setCurrentVariantIndex(updatedVariantIdx ?? 0);
    },
    [product.variants],
  );

  const mappedProduct = useMemo(
    () => mapProduct(product, { variantIndex: currentVariantIndex }),
    [product, currentVariantIndex],
  );

  const currentColor = useMemo(() => {
    const variant = product.variants[currentVariantIndex];
    return variant.attributes?.color ? mapAttribute(variant.attributes.color) : undefined;
  }, [product, currentVariantIndex]);

  const currentSpecs = useMemo(() => {
    const variant = product.variants[currentVariantIndex];
    return variant.attributes?.model
      ? mapAttribute({ label: variant.attributes.model, key: variant.attributes.model })
      : undefined;
  }, [product, currentVariantIndex]);

  return {
    currentColor,
    currentSpecs,
    mappedProduct,
    onChangeVariant,
  };
};

export default usePDPProduct;
