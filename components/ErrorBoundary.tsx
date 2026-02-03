
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-rose-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Something went wrong</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              The dashboard encountered an unexpected error. This has been logged for our engineers.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all"
            >
              <RefreshCw size={18} />
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    // Fix: In React class components, props are accessed via this.props
    return this.props.children;
  }
}

export default ErrorBoundary;
