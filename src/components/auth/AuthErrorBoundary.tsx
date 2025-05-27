
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
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);
  }

  public resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
    
    // Force page reload for authentication errors
    if (this.state.error?.message?.includes("authentication") || 
        this.state.error?.message?.includes("sign")) {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Alert variant="destructive" className="my-4 bg-white border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            <div className="mt-2">
              <p className="mb-2">There was a problem with authentication. Please try again.</p>
              <Button 
                onClick={this.resetErrorBoundary}
                variant="outline" 
                size="sm" 
                className="mt-4 rounded-md"
              >
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
