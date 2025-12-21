import React from 'react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // You can also log the error to an error reporting service here
        // e.g., Sentry, LogRocket, etc.

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            const { fallback } = this.props;

            if (fallback) {
                return fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full">
                        <div className="card">
                            <div className="card-body text-center space-y-4">
                                {/* Error Icon */}
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-error-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Error Title */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                        Oops! Something went wrong
                                    </h2>
                                    <p className="text-gray-600">
                                        We encountered an unexpected error. Please try again.
                                    </p>
                                </div>

                                {/* Error Details (Development only) */}
                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                                        <p className="text-sm font-mono text-error-600 mb-2">
                                            {this.state.error.toString()}
                                        </p>
                                        {this.state.errorInfo && (
                                            <details className="text-xs text-gray-600">
                                                <summary className="cursor-pointer font-medium mb-2">
                                                    Stack trace
                                                </summary>
                                                <pre className="overflow-auto max-h-40 whitespace-pre-wrap">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-center pt-2">
                                    <button
                                        onClick={this.handleReset}
                                        className="btn-outline"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="btn-primary"
                                    >
                                        Go Home
                                    </button>
                                </div>

                                {/* Support Link */}
                                <p className="text-sm text-gray-500">
                                    If the problem persists, please{' '}
                                    <a href="/contact" className="link">
                                        contact support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
