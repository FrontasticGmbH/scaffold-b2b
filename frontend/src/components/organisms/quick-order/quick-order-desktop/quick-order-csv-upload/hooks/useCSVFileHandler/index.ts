import { useState } from 'react';
import toast from '@/components/atoms/toaster/helpers/toast';
import { useTranslations } from 'use-intl';

const useCSVFileHandler = () => {
  const translate = useTranslations();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<Record<string, string>>({});
  const [readFiles, setReadFiles] = useState<Record<string, string>>({});
  const [loadingProgress, setLoadingProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleFile = (inputFiles: File[]) => {
    const newFileError = { ...fileError };
    const resultFiles: File[] = [];
    inputFiles.forEach((inputFile) => {
      if (files.find((file) => file.name === inputFile.name && file.type === inputFile.type)) {
        toast.error(
          translate('quick-order.error-file-exists', {
            file: inputFile.name,
          }),
        );
      } else {
        if (inputFile.type != 'text/csv') newFileError[inputFile.name] = translate('quick-order.error-format-file');

        resultFiles.push(inputFile);
      }
    });
    setFileError(newFileError);
    setFiles((array) => [...resultFiles, ...array]);
  };

  const handleFileReader = (files: File[]) => {
    files.forEach((file) => {
      if (!fileError[file.name]) {
        const reader = new FileReader();

        reader.onload = () => {
          const includesSKU = (reader.result as string).split(',')[0].toLowerCase().includes('sku');
          const includesQuantity = (reader.result as string).split(',')[1].toLowerCase().includes('quantity');

          if ((reader.result as string).split('\n').length > 501)
            setFileError((fileError) => ({ ...fileError, [file.name]: translate('quick-order.error-file-exceeds') }));
          setReadFiles((readFiles) => ({ ...readFiles, [file.name]: reader.result as string }));
          if (!includesSKU || !includesQuantity)
            setFileError((fileError) => ({ ...fileError, [file.name]: translate('quick-order.error-format') }));

          setLoading((loading) => ({ ...loading, [file.name]: false }));
        };
        reader.onprogress = (e) => {
          setLoading((loading) => ({ ...loading, [file.name]: true }));
          setLoadingProgress((loadingProgress) => ({ ...loadingProgress, [file.name]: (e.loaded / e.total) * 100 }));
        };
        reader.onerror = () => {
          setFileError((fileError) => ({ ...fileError, [file.name]: translate('quick-order.error-upload-fail') }));
        };
        reader.readAsText(file);
      }
    });
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  const handleClearReadFiles = () => {
    setReadFiles({});
  };

  const handleRemoveClick = (removedFile: File) => {
    if (Object.keys(fileError).length > 0) {
      const newFileError = { ...fileError };
      delete newFileError[removedFile.name];
      setFileError(newFileError);
    }
    if (Object.keys(readFiles).length > 0) {
      const newReadFiles = { ...readFiles };
      delete newReadFiles[removedFile.name];
      setReadFiles(newReadFiles);
    }
    setFiles((files) => files.filter((file) => file.name != removedFile.name));
  };

  return {
    files,
    readFiles,
    fileError,
    loadingProgress,
    loading,
    handleFile,
    handleFileReader,
    handleClearFiles,
    handleRemoveClick,
    handleClearReadFiles,
  };
};
export default useCSVFileHandler;
