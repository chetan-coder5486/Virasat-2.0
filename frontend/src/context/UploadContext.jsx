import { createContext, useContext, useState } from "react";

const UploadContext = createContext(null);

export const useUpload = (scope = null) => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }

  // If scope is provided, only return upload state if it matches the current scope
  if (scope !== null) {
    return {
      isUploading: context.uploadScope === scope && context.isUploading,
      uploadProgress:
        context.uploadScope === scope ? context.uploadProgress : 0,
      currentFileName:
        context.uploadScope === scope ? context.currentFileName : "",
      updateUploadProgress: context.updateUploadProgress,
      clearUploadState: context.clearUploadState,
    };
  }

  return context;
};

export const UploadProvider = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const [uploadScope, setUploadScope] = useState(null);

  const updateUploadProgress = (data, scope = null) => {
    // Set the scope on first upload
    if (!isUploading && scope !== null) {
      setUploadScope(scope);
    }

    setCurrentFileName(data.fileName);
    setUploadProgress(data.progress);

    if (!data.completed) {
      setIsUploading(true);
    } else {
      // Keep showing the skeleton for 2 seconds after completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setCurrentFileName("");
        setUploadScope(null);
      }, 2000);
    }
  };

  const clearUploadState = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setCurrentFileName("");
    setUploadScope(null);
  };

  return (
    <UploadContext.Provider
      value={{
        isUploading,
        uploadProgress,
        currentFileName,
        uploadScope,
        updateUploadProgress,
        clearUploadState,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
