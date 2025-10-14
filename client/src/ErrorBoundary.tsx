import * as React from "react";

export type FallbackProps = {
  onClearError: () => void;
};

type Props = {
  children?: React.ReactNode;
  fallback: React.ComponentType<FallbackProps>;
};

export class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      return <Fallback onClearError={this.reset} />;
    }
    return this.props.children;
  }
}
