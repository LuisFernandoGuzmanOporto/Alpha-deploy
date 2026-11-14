import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Evita la pantalla en blanco si un componente falla al dibujarse. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>Algo salió mal al mostrar esta pantalla: {this.state.error.message}</p>
          <a href="/">Volver al inicio</a>
        </div>
      );
    }
    return this.props.children;
  }
}
