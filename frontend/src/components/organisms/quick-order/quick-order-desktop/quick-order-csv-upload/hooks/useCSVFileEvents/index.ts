import { ChangeEvent, DragEvent, useCallback } from 'react';

const useCSVFileEvents = (handleFile: (inputFiles: File[]) => void, handleFileReader: (files: File[]) => void) => {
  const memoizedHandleFile = useCallback(handleFile, [handleFile]);
  const memoizedFileReader = useCallback(handleFileReader, [handleFileReader]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    memoizedHandleFile(droppedFiles);
    memoizedFileReader(droppedFiles);
  };

  const handleBrowse = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const droppedFiles = Array.from(event.target.files);
      memoizedHandleFile(droppedFiles);
      memoizedFileReader(droppedFiles);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => handleBrowse(event);

  return {
    handleChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};

export default useCSVFileEvents;
