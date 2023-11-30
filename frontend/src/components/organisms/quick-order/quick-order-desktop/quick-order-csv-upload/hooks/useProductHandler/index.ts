import { useCallback, useState } from 'react';
import { Product } from '../../../../types';

const useProductHandlers = (readFiles: Record<string, string>, handleClearFiles: () => void) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const memoizedClearFiles = useCallback(handleClearFiles, [handleClearFiles]);

  const handleUploadClick = (files: File[]) => {
    const newProducts: Product[] = [];
    const newChecked = { ...checked };
    files.forEach((file) => {
      const formattedFile = readFiles[file.name].split('\n').slice(1).slice(0, -1);
      formattedFile.forEach((file) => {
        newChecked[file.split(',')[0]] = true;

        const product: Product = {
          sku: file.split(',')[0],
          quantity: parseInt(file.split(',')[1]),
          inStock: true,
        };
        const target = newProducts.find((productItem) => productItem.sku === product.sku);
        if (target) {
          target.quantity += product.quantity;
        } else {
          newProducts.push(product);
        }
      });
    });

    setChecked(newChecked);
    setProducts(newProducts);
  };

  const onCheckboxChange = (product: Product, value: boolean) => {
    const newChecked = { ...checked };
    newChecked[product.sku] = value;
    setChecked(newChecked);
  };

  const handleProductClear = () => setProducts([]);

  const handleAddToCart = () => {
    const inStockProducts = products.filter((product) => checked[product.sku] && product.inStock);
    console.log('🚀 ~ file: index.ts:89 ~ handleUploadClick ~ inStockProducts:', inStockProducts);
    handleProductClear();
    memoizedClearFiles();
  };

  return {
    checked,
    products,
    handleUploadClick,
    handleProductClear,
    handleAddToCart,
    onCheckboxChange,
  };
};
export default useProductHandlers;
