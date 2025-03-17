import React, { useContext } from 'react';
import Accordion from '@/components/molecules/accordion';
import { useTranslations } from 'use-intl';
import Checkbox from '@/components/atoms/checkbox';
import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import { Product, QuickOrderCSVUploadProps } from '../../types';
import UploadPanel from './upload-panel';
import { QuickOrderDesktopContext } from '../quick-order-csv-upload/context';

const QuickOrderCSVUpload = ({ addItemDisabled }: Partial<QuickOrderCSVUploadProps>) => {
  const translate = useTranslations();

  const {
    checked,
    products,
    productsLoading,
    files,
    addToCartLoading,
    handleProductClear,
    handleAddToCart,
    onCheckboxChange,
  } = useContext(QuickOrderDesktopContext);

  const checkboxLabelClassNames = (product: Product) =>
    classnames(!product.inStock ? 'text-gray-500 line-through' : '');

  const checkboxLabel = (product: Product) => (
    <div className="flex justify-start">
      <div className={checkboxLabelClassNames(product)}>
        <span className="font-medium">SKU:</span>
        <span> {product.sku}</span>
        <span className="font-medium"> {translate('quick-order.quantity')}</span>
        <span> {product.quantity.toString()}</span>
      </div>
    </div>
  );

  const hasInvalidProducts = products.some((product) => !product.exists || !product.inStock);

  return (
    <Accordion defaultIsExpanded={false}>
      <Accordion.Button defaultSpacing={false} className="p-3 text-gray-700">
        {translate('quick-order.upload-csv')}
      </Accordion.Button>
      <Accordion.Panel defaultSpacing={false} className="p-3">
        {productsLoading || products.length === 0 ? (
          <UploadPanel />
        ) : (
          <>
            <Typography fontSize={14}>{translate('quick-order.select-items')}</Typography>
            <div className="mt-3 flex flex-col gap-y-4">
              {products.map((product) => (
                <div key={product.sku}>
                  <Checkbox
                    size="lg"
                    checked={checked[product.sku]}
                    disabled={!product.inStock}
                    label={checkboxLabel(product)}
                    onChecked={(value) => onCheckboxChange(product, value)}
                  />
                  {product.exists && !product.inStock && (
                    <Typography fontSize={12} className="ml-7 mt-1 w-fit rounded-sm bg-red-100 px-2 py-1 text-red-600">
                      {translate('quick-order.out-of-stock')}
                    </Typography>
                  )}
                  {!product.exists && (
                    <Typography fontSize={12} className="ml-7 mt-1 w-fit rounded-sm bg-red-100 px-2 py-1 text-red-600">
                      {translate('quick-order.item-not-located')}
                    </Typography>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between gap-x-2">
              <Button
                disabled={files.length === 0}
                variant="secondary"
                size="full"
                className="text-14"
                onClick={handleProductClear}
              >
                {translate('quick-order.click-clear')}
              </Button>
              <Button
                variant="primary"
                size="full"
                className="text-14"
                loading={addToCartLoading}
                onClick={handleAddToCart}
                disabled={addItemDisabled || hasInvalidProducts}
              >
                {translate('quick-order.add-to-cart')}
              </Button>
            </div>
          </>
        )}
      </Accordion.Panel>
    </Accordion>
  );
};
export default QuickOrderCSVUpload;
