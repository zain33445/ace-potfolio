'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <section
          role="alert"
          className="relative bg-background border-b border-blueprint-line px-6 py-24"
        >
          <div className="max-w-lg mx-auto text-center space-y-4">
            <span className="font-mono text-sm text-primary font-bold block">
              Section Unavailable
            </span>
            <h2 className="font-space text-2xl font-extrabold text-on-background">
              This section encountered an error
            </h2>
            <p className="font-sans text-on-surface-variant">
              Something went wrong while rendering this section. Please try refreshing the page.
            </p>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
