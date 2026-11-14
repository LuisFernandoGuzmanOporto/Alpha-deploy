import { Component, type ContextType, type ErrorInfo, type ReactNode } from "react";
import { LanguageContext } from "../i18n";
import { makeT } from "../i18n/messages";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Evita la pantalla en blanco si un componente falla al dibujarse. */
export class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext;
  declare context: ContextType<typeof LanguageContext>;

  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const t = makeT(this.context.lang);
      return (
        <div role="alert">
          <p>{t("error.boundary", { message: this.state.error.message })}</p>
          <a href="/">{t("common.backHome")}</a>
        </div>
      );
    }
    return this.props.children;
  }
}
