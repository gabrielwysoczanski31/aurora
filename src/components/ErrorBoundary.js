import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    const { fallback, children } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback(this.state.error, this.state.errorInfo);
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">
              We're sorry, but there was an error in this part of the application. 
              You can try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700">Error details:</p>
                <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-40">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;