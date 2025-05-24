
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("Component Error Boundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Log to external service if needed
    // logErrorToService(error, errorInfo);
  }

  public resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Force page reload for critical errors
    if (this.state.error?.message?.includes("Vm() is null") || 
        this.state.error?.message?.includes("Cannot read properties")) {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert variant="destructive" className="my-4 bg-white border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="mb-2">{this.state.error?.message || "An unexpected error occurred"}</p>
              {this.state.errorInfo && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer">View technical details</summary>
                  <pre className="overflow-auto p-2 bg-gray-100 rounded mt-2 max-h-40 text-xs">
                    {this.state.error?.stack || "No stack trace available"}
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
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
