import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/80 backdrop-blur-md z-0 pointer-events-none">
          <div className="border border-red-500/30 rounded-2xl p-6 text-center bg-red-950/40">
            <p className="text-lg font-medium text-red-400">
              Erro ao carregar ambiente 3D
            </p>
            <p className="text-sm text-red-400/70 mt-2">
              O restante do aplicativo continua funcionando normalmente.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
