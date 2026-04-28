'use client';
import React from 'react';

type Props = { children: React.ReactNode };

export default class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({
        type: 'client_error',
        message: error.message,
        stack: error.stack,
        info,
        url: window.location.href,
        ts: Date.now(),
      }),
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-6 text-center text-white/70">Something went wrong. Try again.</div>;
    }
    return this.props.children;
  }
}