import React from 'react';

const LoadingOverlay: React.FunctionComponent<{ loading: boolean }> = ({
  loading,
}) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-dotted border-blue-500"></div>
    </div>
  );
};

export default LoadingOverlay;
