import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Error Boundary component to gracefully handle runtime errors
 * and prevent the entire app from crashing
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    // In production, you could send this to an error reporting service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--brand-surface, #fff)',
            borderRadius: '12px',
            border: '1px solid var(--brand-border, #d1d9e6)',
            margin: '1rem',
          }}
        >
          <h2 style={{ color: 'var(--brand-primary, #003082)', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--brand-text-muted, #4b5a6b)', marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.5rem 1.5rem',
              background: 'var(--brand-primary, #003082)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--brand-text-muted)' }}>
                Error Details
              </summary>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.85rem',
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
}

export default ErrorBoundary
