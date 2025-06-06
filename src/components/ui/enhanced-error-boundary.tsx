
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Enhanced Error Boundary caught an error:", error);
    console.error("Error info:", errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg bg-white dark:bg-gray-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-gray-900 dark:text-gray-100">Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                
                {this.state.errorInfo && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      View technical details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={this.resetErrorBoundary}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Try again
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline" 
                    size="sm"
                  >
                    Reload page
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
