import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { StylesProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import store from "./app/store";

const AllTheProviders: React.FunctionComponent<React.ReactNode> = ({
  children,
}) => {
  return (
    <StylesProvider injectFirst>
      <SnackbarProvider>
        <Provider store={store}>{children}</Provider>
      </SnackbarProvider>
    </StylesProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
