
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class SafeErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("SafeErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  public componentDidUpdate(prevProps: Props): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;
    
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey)) {
        this.resetErrorBoundary();
      }
    }
  }

  public resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  public handleRetry = (): void => {
    this.resetErrorBoundary();
    
    // Auto-refresh if too many retries
    if (this.state.retryCount >= 2) {
      this.resetTimeoutId = window.setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[200px] flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                {this.state.retryCount < 3 ? (
                  <Button 
                    onClick={this.handleRetry}
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Try again ({3 - this.state.retryCount} attempts left)
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Refresh page
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
