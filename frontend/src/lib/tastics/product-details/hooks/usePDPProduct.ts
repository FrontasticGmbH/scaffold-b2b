import { useCallback, useMemo } from 'react';
import { mapProduct } from '@/utils/mappers/map-product';
import { Product as SharedProduct } from '@shared/types/product';
import { mapAttribute } from '@/utils/mappers/map-attribute';
import usePath from '@/hooks/usePath';
import useCustomRouter from '@/hooks/useCustomRouter';

const usePDPProduct = (product: SharedProduct) => {
  const router = useCustomRouter();
  const { path } = usePath();

  //   Update the currentVariantIndex to use the sku from the path
  const currentVariantIndex = product.variants.findIndex((v) => v.sku === path.split('/')[3]);

  const onChangeVariant = useCallback(
    (variant: 'color' | 'model', value: string) => {
      const updatedVariantSKU = product.variants.find((v) =>
        v.attributes?.[variant].key ? v.attributes?.[variant].key === value : v.attributes?.[variant] === value,
      )?.sku;

      router.replace(`/slug/p/${updatedVariantSKU}`);
    },
    [product.variants, router],
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
