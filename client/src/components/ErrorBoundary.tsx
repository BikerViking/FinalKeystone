import React, { ErrorInfo } from 'react';

type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook for logging (no PII)
    // console.warn('ErrorBoundary', { error, info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-[60svh] grid place-items-center px-4">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-extrabold">Something went wrong.</h1>
            <p className="text-muted mt-2">Please refresh the page. If the problem persists, contact support.</p>
          </div>
        </main>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
