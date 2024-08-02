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

  const mappedProducts = products.map((product) => ({
    sku: product.sku,
    quantity: product.quantity,
    inStock: csvProducts.some((p) => p.sku === product.sku && p.inStock && p.quantity >= product.quantity),
    exists: csvProducts.some((p) => p.sku === product.sku),
  }));

  const handleUploadClick = (files: File[]) => {
    const newProducts: Product[] = [];
    const newChecked = { ...checked };

    files.forEach((file) => {
      const formattedFile = readFiles[file.name]
        .split('\n')
        .slice(1)
        .filter(Boolean)
        .filter((l) => l.includes(','));

      const readProducts = formattedFile.map((l) => ({
        sku: l.split(',')[0].trim(),
        quantity: parseInt(l.split(',')[1].trim() || '1'),
      }));

      const skus = readProducts.map((p) => p.sku);

      handleSKUsUpdate?.(skus);

      readProducts.forEach((p) => {
        newChecked[p.sku] = true;

        const product: Product = {
          sku: p.sku,
          quantity: p.quantity,
          inStock: false,
          exists: false,
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
    setLoading(true);
    const inStockProducts = mappedProducts.filter((product) => checked[product.sku] && product.inStock);
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
    products: mappedProducts,
    handleUploadClick,
    handleProductClear,
    handleAddToCart,
    onCheckboxChange,
  };
};
export default useProductHandlers;
