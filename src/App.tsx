import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import VideoCall from "./features/videoCall/VideoCall";
import { StylesProvider } from "@material-ui/core/styles";

function App() {
  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <VideoCall />
    </StylesProvider>
  );
}

export default App;
