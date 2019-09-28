import React, { useContext } from "react";
import web3 from "web3";
import { Web3Context } from "./Web3Context";

function App() {
  const { checkOwner, claimQR, state } = useContext(Web3Context);
  const qr = window.location.pathname.split("/")[1].split("-");
  console.log(qr);
  return (
    <div>
      <button onClick={() => claimQR(qr)}>claim</button>
      <button onClick={() => checkOwner(web3.utils.keccak256(qr[1]))}>
        Check owner
      </button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
}

export default App;
