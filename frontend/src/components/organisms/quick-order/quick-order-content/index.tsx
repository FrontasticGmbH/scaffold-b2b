import React, { useState } from 'react';
import Button from '@/components/atoms/button';
import { PlusIcon as AddItemIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Search from '../../search';
import ProductItem from './product-item';
import { Suggestion } from '../../search/types';
import useProductSearch from '../../search/hooks/useProductSearch';
import { QuickOrderContentProps } from '../types';

const QuickOrderContent = ({ items }: QuickOrderContentProps) => {
  const { translate } = useTranslation();
  const [showSearch, setShowSearch] = useState(true);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const { handleOnChange, insertProduct, removeProduct, searchResult, products, searchValue } = useProductSearch(items);

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleProductSearchClick = (product: Suggestion) => {
    if (!products.find((prod) => prod.sku === product.sku)) {
      insertProduct(product);
    } else {
      const newQuantity = { ...quantity };
      newQuantity[product.sku] = Math.min(product.maxQuantity ?? Infinity, (quantity[product.sku] ?? 1) + 1);
      setQuantity(newQuantity);
    }
    setShowSearch(false);
  };

  const handleQuantityChange = (product: Suggestion, value: number) => {
    if (value < 1) removeProduct(product);
    if (products.length === 0) setShowSearch(false);

    if (value > 0) {
      const newQuantity = { ...quantity };
      newQuantity[product.sku] = value;

      setQuantity(newQuantity);
    }
  };
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
          scrollControl={false}
          variant="sm"
          filterSearch={false}
          placeholder={translate('common.search')}
          searchValue={searchValue}
          handleOnChange={handleOnChange}
          suggestions={items}
          searchResult={searchResult}
          onClick={handleProductSearchClick}
        />
      )}
      <div className="mt-5 flex items-center justify-start gap-x-2">
        {!showSearch && (
          <Button onClick={handleShowSearch} variant="secondary" size="icon">
            <AddItemIcon className="w-5" />
          </Button>
        )}
        <Button disabled={products.length <= 0} size="m" variant="primary" className="text-14">
          {translate('quick-order.add.to.cart')}
        </Button>
      </div>
    </>
  );
};

export default QuickOrderContent;
