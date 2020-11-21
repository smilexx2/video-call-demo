import "fontsource-roboto";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import { StylesProvider } from "@material-ui/core/styles";
import App from "./App";
import GlobalError from "./GlobalError";
import store from "./app/store";
import { SnackbarProvider } from "notistack";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <GlobalError>
        <SnackbarProvider>
          <Provider store={store}>
            <CssBaseline />
            <App />
          </Provider>
        </SnackbarProvider>
      </GlobalError>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
