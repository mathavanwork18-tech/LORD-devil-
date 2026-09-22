import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VOID MATRIX RUNTIME FAULT:', error, errorInfo);
  }

  private handleReboot = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030207] flex items-center justify-center p-6 text-center select-none font-mono">
          <div className="max-w-md void-panel rounded-2xl p-8 border-void-crimson/50 shadow-2xl relative glow-border-crimson">
            <div className="w-16 h-16 rounded-full bg-void-crimson/20 border border-void-crimson/60 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertOctagon className="w-8 h-8 text-void-crimson" />
            </div>

            <h1 className="text-xl font-bold tracking-widest text-white mb-2 uppercase">
              VOID MATRIX ANOMALY DETECTED
            </h1>
            <p className="text-xs text-void-muted mb-6 leading-relaxed">
              A dimensional quantum rupture disrupted the local interface stream. The imperial subsystems have contained the breach.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/80 rounded border border-void-crimson/20 text-left text-[11px] text-void-crimson mb-6 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReboot}
              className="w-full py-3 rounded-lg bg-void-crimson hover:bg-red-600 text-white font-bold tracking-widest text-xs flex items-center justify-center gap-2 shadow-glow-crimson transition active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REBOOT IMPERIAL SUBSYSTEM</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
