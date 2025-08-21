import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you could send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';
      
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-lg w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-slate-300 mb-4">
              Приложение столкнулось с неожиданной ошибкой. Мы работаем над исправлением проблемы.
            </p>
            
            {isDev && this.state.error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-left text-sm">
                <strong className="text-red-400">Error:</strong>
                <div className="text-red-300 font-mono mt-1">
                  {this.state.error.toString()}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="text-red-400 cursor-pointer">Stack Trace</summary>
                    <pre className="text-red-300 text-xs mt-1 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Попробовать снова
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Перезагрузить страницу
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;