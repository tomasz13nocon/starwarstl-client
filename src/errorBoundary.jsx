import React from "react";
import { analytics } from "./analytics";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    analytics.logEvent(
      "Error boundary reached",
      error.message ?? "No message",
      info.componentStack ?? "No stack",
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ margin: "1rem" }}>
          <h1>Unexpected error occured.</h1>
          <h2>{"Sorry, this wasn't supposed to happen :/"}</h2>
          <p>
            The chancellor <small style={{ fontSize: "0.75em" }}>(website owner)</small> was
            informed of this incident.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
