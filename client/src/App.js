import React, { useContext, useEffect } from "react";
import web3 from "web3";
import { Web3Context } from "./Web3Context";
import { isOwned } from "./constants";

function App() {
  const { checkOwner, checkQR, claimQR, state } = useContext(Web3Context);
  const qr = window.location.pathname.split("/")[1].split("-");

  useEffect(() => {
    checkOwner(web3.utils.keccak256(qr[1]))
    return () => {
    };
  }, [])

  const { ownership: { owner }, fetcher: { status, response } } = state;
  if (status === "FETCHING") return <div style={{ color: "red" }}>{status}</div>

  return (
    <div>
      <div style={{ color: "red" }}>{status}</div>
      {isOwned(owner) ? <div>is owned</div> : <div>not owned</div>}
      <button onClick={() => claimQR(qr)}>claim</button>
      <div>{JSON.stringify(state)}</div>
    </div>
  );
}

export default App;
