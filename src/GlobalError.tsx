import React, { Component, ReactNode } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
        >
          <Container maxWidth="sm">
            <Typography variant="h1" gutterBottom>
              Oops!
            </Typography>
            <Typography variant="h3">Something went wrong</Typography>
          </Container>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
