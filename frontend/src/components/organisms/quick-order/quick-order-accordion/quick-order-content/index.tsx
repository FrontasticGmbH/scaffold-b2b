import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/atoms/button';
import { PlusIcon as AddItemIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Search from '../../../search';
import ProductItem from './product-item';
import { ProductSuggestion } from '../../../search/types';
import useQuickProductSearch from '../../../search/hooks/useProductSearch';
import { QuickOrderContentProps } from '../../types';

const QuickOrderContent = ({
  items,
  searchText,
  onSearch,
  addItem,
  addItemDisabled,
  closeMenu,
}: QuickOrderContentProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { translate } = useTranslation();
  const [showSearch, setShowSearch] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const { insertProduct, removeProduct, searchResult, products } = useQuickProductSearch(items);

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  useEffect(() => {
    if (showSearch && products.length > 0) inputRef.current?.focus();
  }, [showSearch, products]);

  const handleProductSearchClick = (product: ProductSuggestion) => {
    if (!products.find((prod) => prod.sku === product.sku)) {
      insertProduct(product);
    } else {
      const newQuantity = { ...quantity };
      newQuantity[product.sku] = Math.min(product.maxQuantity ?? Infinity, (quantity[product.sku] ?? 1) + 1);
      setQuantity(newQuantity);
    }
    setShowSearch(false);
  };

  const handleQuantityChange = (product: ProductSuggestion, value: number) => {
    if (value < 1) removeProduct(product);
    if (products.length === 0) setShowSearch(false);

    if (value > 0) {
      const newQuantity = { ...quantity };
      newQuantity[product.sku] = value;

      setQuantity(newQuantity);
    }
  };

  const lineItems = useMemo(
    () =>
      products.map(({ sku }) => {
        return { sku: sku, count: quantity[sku] ?? 1 };
      }),
    [products, quantity],
  );

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true);
    await addItem?.(lineItems);
    setAddingToCart(false);
    closeMenu?.();
  }, [addItem, closeMenu, lineItems]);

  return (
    <>
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          quantity={quantity[product.sku] ?? 1}
          handleQuantityChange={handleQuantityChange}
        />
      ))}

      {(showSearch || products.length === 0) && (
        <Search
          ref={inputRef}
          scrollControl={false}
          variant="sm"
          filterSearch={false}
          placeholder={translate('common.search')}
          searchValue={searchText}
          handleOnChange={onSearch}
          suggestions={items}
          searchResult={searchResult}
          onProductClick={handleProductSearchClick}
        />
      )}
      <div className="mt-5 flex items-center justify-start gap-x-2">
        {!showSearch && (
          <Button
            data-testid="quick-order-add-item-button"
            onClick={handleShowSearch}
            variant="secondary"
            size="l"
            Icon={AddItemIcon}
            disabled={addItemDisabled}
          />
        )}
        <Button
          loading={addingToCart}
          onClick={handleAddToCart}
          disabled={products.length <= 0 || addItemDisabled}
          size="m"
          variant="primary"
          className="text-14"
        >
          {translate('quick-order.add.to.cart')}
        </Button>
      </div>
    </>
  );
};

export default QuickOrderContent;
