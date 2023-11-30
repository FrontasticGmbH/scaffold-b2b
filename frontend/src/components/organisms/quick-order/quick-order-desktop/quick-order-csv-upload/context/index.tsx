import React, { createContext } from 'react';
import { Product, QuickOrderCSVUploadProps } from '../../../types';
import useProductHandlers from '../hooks/useProductHandler';
import useCSVFileHandler from '../hooks/useCSVFileHandler';
import useCSVFileEvents from '../hooks/useCSVFileEvents';

const initialQuickOrderState = {
  downloadLink: '' as string,
  files: [] as File[],
  fileError: {} as Record<string, string>,
  loading: {} as Record<string, boolean>,
  loadingProgress: {} as Record<string, number>,
  handleClearFiles: {} as () => void,
  handleClearReadFiles: {} as () => void,
  handleRemoveClick: {} as (removedFile: File) => void,
  products: [] as Product[],
  checked: {} as Record<string, boolean>,
  handleAddToCart: {} as () => void,
  onCheckboxChange: {} as (product: Product, value: boolean) => void,
  handleUploadClick: {} as (files: File[]) => void,
  handleProductClear: {} as () => void,
  handleDragLeave: {} as (event: React.DragEvent<HTMLDivElement>) => void,
  handleDrop: {} as (event: React.DragEvent<HTMLDivElement>) => void,
  handleDragOver: {} as (event: React.DragEvent<HTMLDivElement>) => void,
  handleChange: {} as (event: React.ChangeEvent<HTMLInputElement>) => void,
};

const QuickOrderDesktopContext = createContext(initialQuickOrderState);

const QuickOrderDesktopProvider = ({ downloadLink, children }: React.PropsWithChildren<QuickOrderCSVUploadProps>) => {
  const {
    files,
    readFiles,
    fileError,
    loading,
    loadingProgress,
    handleFile,
    handleFileReader,
    handleClearFiles,
    handleClearReadFiles,
    handleRemoveClick,
  } = useCSVFileHandler();
  const { handleChange, handleDragLeave, handleDragOver, handleDrop } = useCSVFileEvents(handleFile, handleFileReader);
  const { checked, products, handleUploadClick, handleAddToCart, onCheckboxChange, handleProductClear } =
    useProductHandlers(readFiles, handleClearFiles);
  return (
    <QuickOrderDesktopContext.Provider
      value={{
        files,
        checked,
        downloadLink,
        loading,
        loadingProgress,
        fileError,
        products,
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
