// src/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode; // Definiere den Typ für children
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught in Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Etwas ist schiefgelaufen.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
