import { useCallback, useState } from 'react';
import { Product } from '../../../../types';

const useProductHandlers = (
  csvProducts: Product[],
  readFiles: Record<string, string>,
  handleClearFiles: () => void,
  addToCart?: (
    lineItems: {
      sku: string;
      count: number;
    }[],
  ) => Promise<void>,
  handleSKUsUpdate?: (skus: string[]) => void,
  onClose?: () => void,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const memoizedClearFiles = useCallback(handleClearFiles, [handleClearFiles]);
  const [loading, setLoading] = useState(false);

  const productMapper = (file: string): Product => {
    return {
      sku: file.split(',')[0],
      quantity: parseInt(file.split(',')[1]),
      inStock: csvProducts.find(
        (product) =>
          product.sku === file.split(',')[0] && product.inStock && product.quantity >= parseInt(file.split(',')[1]),
      )
        ? true
        : false,
      exists: csvProducts.find((product) => product.sku === file.split(',')[0]) ? true : false,
    };
  };

  const handleUploadClick = (files: File[]) => {
    const newProducts: Product[] = [];
    const newChecked = { ...checked };

    files.forEach((file) => {
      const formattedFile = readFiles[file.name].split('\n').slice(1).slice(0, -1);
      const skus = formattedFile.map((file) => {
        return file.split(',')[0];
      });
      handleSKUsUpdate?.(skus);

      formattedFile.forEach((file) => {
        newChecked[file.split(',')[0]] = true;

        const product: Product = productMapper(file);
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
    setLoading(true);
    const inStockProducts = products.filter((product) => checked[product.sku] && product.inStock);
    const lineItems = inStockProducts.map((item) => {
      return { sku: item.sku, count: item.quantity };
    });
    addToCart?.(lineItems).then(() => {
      setLoading(false);
      onClose?.();
      handleProductClear();
      memoizedClearFiles();
    });
  };

  return {
    loading,
    checked,
    products,
    handleUploadClick,
    handleProductClear,
    handleAddToCart,
    onCheckboxChange,
  };
};
export default useProductHandlers;
