import React, { Fragment, useContext } from "react";
import Admin from "./Admin";
import App from "./App";
import { DeviceContext } from "./DeviceContext";
import AR from "./AR";

const Chooser = () => {
  const { admin } = useContext(DeviceContext);
  return <AR />
  // return <Fragment>{admin ? <Admin /> : <App />}</Fragment>;
};

export default Chooser;
