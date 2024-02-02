'use client';

import { useCallback, useMemo, useState } from 'react';
import { ProductDetailsProps, ShippingMethod, Wishlist } from '@/components/organisms/product-details/types';
import ProductDetails from '@/components/organisms/product-details';
import useCart from '@/lib/hooks/useCart';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { ShippingRate } from '@shared/types/cart';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Attribute, Product } from '@/types/entity/product';
import { Currency } from '@/types/currency';
import { Variant } from '@shared/types/product';
import { getLocalizationInfo } from '@/project.config';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { ProductDetailsMapperProps } from '../types';

const ProductDetailsMapper = ({ product }: ProductDetailsMapperProps) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  const { translate } = useTranslation();
  const { selectedLocation } = useShipAndLanguage();
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { purchaseLists: wishlists, addToWishlists: CTAddToWishlists } = usePurchaseLists(selectedStore?.key);
  const { addItem, shippingMethods } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const addToCart = useCallback(
    async (count: number) => {
      await addItem([{ sku: product.variants[currentVariantIndex].sku ?? '', count }]);
    },
    [addItem, currentVariantIndex, product.variants],
  );

  const getWishlists = useCallback(async (): Promise<Wishlist[] | undefined> => {
    if (selectedStore?.key) {
      const shoppingLists = wishlists?.map((wishlist) => ({
        id: wishlist.wishlistId,
        label: wishlist.name,
        productIsInWishlist: !!wishlist.lineItems?.find((item) => item.productId === product.productId),
      })) as Array<Wishlist>;

      return shoppingLists;
    } else return [];
  }, [wishlists, product.productId, selectedStore?.key]);

  const getShippingPrice = useCallback(
    (rates: Array<ShippingRate>): number => {
      const { countryCode } = getLocalizationInfo(selectedLocation?.value ?? 'sv');

      const currentRate = rates?.find((rate) => rate.name === countryCode);
      return (currentRate?.price?.centAmount ?? 1000) / 100;
    },
    [selectedLocation],
  );

  const getShippingMethods = useCallback((): Array<ShippingMethod> => {
    const mappedShippingMethods =
      (shippingMethods?.map((method) => ({
        label: method.name ?? '',
        price: getShippingPrice(method.rates ?? []),
        estimatedDeliveryDays: parseInt(method.description ?? '3'),
      })) as Array<ShippingMethod>) ?? [];

    return mappedShippingMethods;
  }, [getShippingPrice, shippingMethods]);

  const onChangeVariant = useCallback(
    (variant: 'color' | 'specs', value: string) => {
      const updatedVariantIdx = product.variants.findIndex((v) => v.attributes?.[variant].key === value);
      setCurrentVariantIndex(updatedVariantIdx ?? 0);
    },
    [product.variants],
  );

  const addToWishlists = useCallback(
    async (wishlistIds: string[]) => {
      return await CTAddToWishlists({
        wishlistIds,
        sku: product.variants[currentVariantIndex].sku ?? '',
        count: 1,
      }).then((res) => {
        return res.data?.map((wishlist) => ({
          label: wishlist.name,
          id: wishlist.wishlistId,
        })) as Wishlist[];
      });
    },
    [CTAddToWishlists, currentVariantIndex, product.variants],
  );

  const mapColorAttributes = useCallback((variant: Variant): Attribute => {
    return {
      label: variant.attributes?.color.label,
      value: variant.attributes?.color.key,
    };
  }, []);

  const productDetailsProps: ProductDetailsProps = useMemo(() => {
    const variant = product.variants[currentVariantIndex];

    const currentColor: ProductDetailsProps['currentColor'] = variant.attributes?.color
      ? mapColorAttributes(variant)
      : undefined;

    const colors: Product['colors'] = currentColor
      ? product.variants.map((variant) => {
          return mapColorAttributes(variant);
        })
      : [];

    return {
      product: {
        id: product.productId ?? '',
        sku: variant.sku ?? '',
        name: product.name ?? '',
        currency: (variant.price?.currencyCode ?? 'USD') as Currency,
        model: variant.sku ?? '',
        images: variant.images ?? [],
        price: (variant.price?.centAmount ?? 1000) / 100,
        colors,
        discountedPrice: variant.discountedPrice ? (variant.discountedPrice?.centAmount ?? 1000) / 100 : undefined,
        categories: product.categories?.map((category) => ({
          categoryId: category.categoryId ?? '',
          name: category.name ?? '',
        })),
      },
      currentColor,
      additionalInfo: [
        {
          title: translate('product.details'),
          description: product.description,
        },
        {
          title: translate('product.specifications'),
          description: product?.variants[currentVariantIndex].attributes?.['Product-Specifications'],
        },
      ],
      shippingMethods: getShippingMethods(),
      addToCart,
      getWishlists,
      addToWishlists,
      onChangeVariant,
    };
  }, [
    product.variants,
    product.productId,
    product.name,
    product.categories,
    product.description,
    currentVariantIndex,
    mapColorAttributes,
    translate,
    getShippingMethods,
    addToCart,
    getWishlists,
    addToWishlists,
    onChangeVariant,
  ]);

  return <ProductDetails {...productDetailsProps} />;
};

export default ProductDetailsMapper;
