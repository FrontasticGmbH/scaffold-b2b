import React, { createContext } from 'react';
import { QuickOrderCSVUploadProps, contextShape } from '../../../types';
import useProductHandlers from '../hooks/useProductHandler';
import useCSVFileHandler from '../hooks/useCSVFileHandler';
import useCSVFileEvents from '../hooks/useCSVFileEvents';

const initialQuickOrderState = {} as contextShape;

const QuickOrderDesktopContext = createContext(initialQuickOrderState);

const QuickOrderDesktopProvider = ({
  csvProducts,
  csvProductsLoading,
  downloadLink,
  addItem,
  handleSKUsUpdate,
  onClose,
  children,
}: React.PropsWithChildren<QuickOrderCSVUploadProps>) => {
  const addToCart = async (
    lineItems: {
      sku: string;
      count: number;
    }[],
  ) => {
    await addItem?.(lineItems);
  };

  const {
    files,
    readFiles,
    fileError,
    loading: fileLoading,
    loadingProgress,
    handleFile,
    handleFileReader,
    handleClearFiles,
    handleClearReadFiles,
    handleRemoveClick,
  } = useCSVFileHandler();
  const { handleChange, handleDragLeave, handleDragOver, handleDrop } = useCSVFileEvents(handleFile, handleFileReader);
  const {
    loading: addToCartLoading,
    checked,
    products,
    handleUploadClick,
    handleAddToCart,
    onCheckboxChange,
    handleProductClear,
  } = useProductHandlers(csvProducts, readFiles, handleClearFiles, addToCart, handleSKUsUpdate, onClose);
  return (
    <QuickOrderDesktopContext.Provider
      value={{
        files,
        checked,
        downloadLink,
        loading: fileLoading,
        loadingProgress,
        fileError,
        addToCartLoading,
        products,
        productsLoading: csvProductsLoading,
        handleProductClear,
        handleChange,
        handleClearFiles,
        handleClearReadFiles,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleRemoveClick,
        handleUploadClick,
        handleAddToCart,
        onCheckboxChange,
      }}
    >
      {children}
    </QuickOrderDesktopContext.Provider>
  );
};
export { QuickOrderDesktopContext, QuickOrderDesktopProvider };
