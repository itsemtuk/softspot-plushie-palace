
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
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
    
    // Force a reload of the page when specific errors occur
    if (this.state.error?.message?.includes("is null") || 
        this.state.error?.message?.includes("Cannot read properties")) {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert variant="destructive" className="my-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              {this.state.error?.message || "An unexpected error occurred"}
              {this.state.errorInfo && (
                <details className="mt-2 text-xs">
                  <summary>View details</summary>
                  <pre className="overflow-auto p-2 bg-gray-100 dark:bg-gray-700 rounded mt-2 max-h-40">
                    {this.state.errorInfo.componentStack || "No stack trace available"}
                  </pre>
                </details>
              )}
            </div>
            <Button 
              onClick={this.resetErrorBoundary}
              variant="outline" 
              size="sm" 
              className="mt-4 rounded-md"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
