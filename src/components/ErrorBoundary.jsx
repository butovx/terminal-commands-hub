import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TerminalHub Error Boundary Caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('terminal_user_stats');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex items-center justify-center p-6 font-sans">
          <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto text-2xl">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">Application Recovered</h2>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                An unexpected state error occurred. Click below to refresh the application cleanly.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-emerald-500 text-black font-mono text-xs font-bold rounded-xl shadow hover:opacity-90 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & Reload TerminalHub
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
