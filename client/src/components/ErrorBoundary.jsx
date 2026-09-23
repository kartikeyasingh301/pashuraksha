import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center", minHeight: "100vh", background: "#f8f9fa", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <ShieldAlert size={64} color="#D32F2F" style={{ marginBottom: "20px" }} />
          <h1 style={{ fontSize: "24px", color: "#333", marginBottom: "8px" }}>UNABLE TO DISPLAY THIS PAGE</h1>
          <p style={{ color: "#666", fontSize: "16px", marginBottom: "24px", maxWidth: "400px" }}>
            The system encountered an unexpected error.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => window.location.reload()} style={{ padding: "12px 24px", background: "#2E7D32", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              TRY AGAIN
            </button>
            <button onClick={() => window.location.href = '/'} style={{ padding: "12px 24px", background: "white", color: "#2E7D32", border: "2px solid #2E7D32", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
              GO TO DASHBOARD
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
