import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import DeviceProvider from "./DeviceContext";
import Web3Provider from "./Web3Context";

ReactDOM.render(
  <DeviceProvider>
    <Web3Provider>
      <App />
    </Web3Provider>
  </DeviceProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
