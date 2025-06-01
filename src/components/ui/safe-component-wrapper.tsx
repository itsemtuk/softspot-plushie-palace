
import React, { ReactNode, Suspense } from 'react';
import { SafeErrorBoundary } from './safe-error-boundary';
import { Spinner } from './spinner';

interface SafeComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  resetKeys?: Array<string | number>;
  className?: string;
}

export const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({
  children,
  fallback,
  loadingFallback,
  resetKeys,
  className
}) => {
  const defaultLoadingFallback = (
    <div className="flex items-center justify-center p-4">
      <Spinner size="md" />
    </div>
  );

  return (
    <div className={className}>
      <SafeErrorBoundary fallback={fallback} resetKeys={resetKeys}>
        <Suspense fallback={loadingFallback || defaultLoadingFallback}>
          {children}
        </Suspense>
      </SafeErrorBoundary>
    </div>
  );
};
