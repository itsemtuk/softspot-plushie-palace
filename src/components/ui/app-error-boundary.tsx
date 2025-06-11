
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
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
    console.error("App Error Boundary caught an error:", error);
    console.error("Error info:", errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  public resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public goHome = (): void => {
    window.location.href = "/";
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Alert variant="destructive" className="max-w-lg bg-white dark:bg-gray-800">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Oops! Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-3 space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We're sorry for the inconvenience. The app encountered an unexpected error.
                </p>
                
                {this.state.error && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      Technical details
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-32">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    onClick={this.resetErrorBoundary}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Try again
                  </Button>
                  
                  <Button 
                    onClick={this.goHome}
                    variant="default" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Home className="h-3 w-3" />
                    Go home
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

export default AppErrorBoundary;
