import React, { useContext, useEffect, useReducer, useState } from "react";
import Web3 from "web3";
import Meowbject from "./contracts/Meowbject";
import { DeviceContext } from "./DeviceContext";

export const Web3Context = React.createContext();

const KALE_A = "u1qhdnj7go";
const KALE_B = "c2uiuaT6hOXr545x90ghGWiuwFC_rLhCTlV0wacrO-k";
const RPC = "u1wxxj5g51-u1ghyojs49-rpc.us1-azure.kaleido.io";

// const blockPoint = "http://localhost:8545";
const blockPoint = `https://${KALE_A}:${KALE_B}@${RPC}`;

const address = "0x64051eB06dC09432944012bB3Ac92E5107e48bBe";
const provider = new Web3.providers.HttpProvider(blockPoint);
const web3 = new Web3(provider);
window.web3 = web3;
const meowb = new web3.eth.Contract(Meowbject.abi, address);
// action types
const FETCHING = "FETCHING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
window.web3 = web3;
window.meow = meowb;
const initialState = { response: null, status: null };

const reducer = (state, action) => {
  const { response, type } = action;
  switch (type) {
    case FETCHING:
      return { ...state, status: FETCHING };
    case SUCCESS:
      return { ...state, status: SUCCESS, response };
    case ERROR:
      console.log(response);
      return { ...state, status: ERROR, response };
    default:
      return state;
  }
};

const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [deviceAddress, setDeviceAddress] = useState();
  const fingerPrint = useContext(DeviceContext);

  useEffect(() => {
    if (fingerPrint) {
      const checkAccount = async () => {
        const hashedFP = web3.utils.keccak256(fingerPrint);
        const account = await meowb.methods.checkAccount(hashedFP).call();
        setDeviceAddress(account);
        if (account === "0x0000000000000000000000000000000000000000") {
          console.log("making new account");
          const newAddress = web3.eth.accounts.create();
          setDeviceAddress(newAddress);
          const addA = await meowb.methods.addAccount(
            hashedFP,
            newAddress.address
          );
          // .send({ from: newAddress.address });
          const encodedABI = addA.encodeABI();
          const tx = {
            from: newAddress.address,
            to: address,
            gas: 2000000,
            data: encodedABI
          };
          const signedT = await web3.eth.accounts.signTransaction(
            tx,
            newAddress.privateKey
          );
          const tranny = await web3.eth.sendSignedTransaction(
            signedT.rawTransaction
          );
        }
      };
      checkAccount();
    }
  }, [fingerPrint]);

  const checkOwner = async qr => {
    dispatch({ type: FETCHING });
    try {
      const response = await meowb.methods.checkOwner(qr).call();
      dispatch({ type: SUCCESS, response });
    } catch (error) {
      dispatch({ type: ERROR, response: error });
    }
  };

  const claimQR = async qr => {
    dispatch({ type: FETCHING });
    try {
      const account = await web3.eth.getAccounts();
      const response = await meowb.methods
        .claimQR(qr[0], qr[1], deviceAddress)
        .send({ from: account[0] });
      dispatch({ type: SUCCESS, response: response });
    } catch (error) {
      dispatch({ type: ERROR, response: error.message });
    }
  };

  return (
    <Web3Context.Provider value={{ state, dispatch, checkOwner, claimQR }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
