import React, { useContext, useEffect, useReducer, useState } from "react";
import Web3 from "web3";
import Meowbject from "./contracts/Meowbject";
import { DeviceContext } from "./DeviceContext";
import { GANACHE_ID, getID, KALE_ID } from "./constants";

export const Web3Context = React.createContext();

const KALE_A = "u1qhdnj7go";
const KALE_B = "c2uiuaT6hOXr545x90ghGWiuwFC_rLhCTlV0wacrO-k";
const RPC = "u1wxxj5g51-u1ghyojs49-rpc.us1-azure.kaleido.io";
const KWS = "u1wxxj5g51-u1ghyojs49-wss.us1-azure.kaleido.io";
// const blockPoint = "http://localhost:8545";
// const wssBP = "ws://localhost:8545";
const blockPoint = `https://${KALE_A}:${KALE_B}@${RPC}`;

// const address = "0x64051eB06dC09432944012bB3Ac92E5107e48bBe";

//const address = Meowbject.networks[GANACHE_ID].address;
const address = Meowbject.networks[KALE_ID].address;
const provider = new Web3.providers.HttpProvider(blockPoint);
const web3 = new Web3(provider);
const meowb = new web3.eth.Contract(Meowbject.abi, address);

// action types
const FETCHING = "FETCHING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const OWNER = "OWNER";
const TRIBUTES = "TRIBUTES";
const PRINT_QR = "PRINT_QR";
window.web3 = web3;
window.meow = meowb;
const initialState = {
  fetcher: { response: null, status: null },
  ownership: { owner: null },
  tributes: { tributes: null },
  qr: null,
  log: []
};

const reducer = (state, action) => {
  const { response, type, owner, tributes, what } = action;
  switch (type) {
    case FETCHING:
      return {
        ...state,
        fetcher: { status: FETCHING },
        log: [...state.log, `FETCHING > ${what}`]
      };
    case SUCCESS:
      return {
        ...state,
        fetcher: { status: SUCCESS, response },
        log: [...state.log, `SUCCESS: ${what} > ${JSON.stringify(response)}`]
      };
    case ERROR:
      return {
        ...state,
        fetcher: { status: ERROR, response },
        log: [...state.log, `ERROR: ${what} > ${JSON.stringify(response)}`]
      };
    case OWNER:
      return { ...state, ownership: { owner } };
    case TRIBUTES: {
      return { ...state, tributes: { tributes } };
    }
    case PRINT_QR: {
      return { ...state, qr: response };
    }
    default:
      return state;
  }
};

const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [deviceAddress, setDeviceAddress] = useState();
  const { fingerPrint } = useContext(DeviceContext);

  useEffect(() => {
    if (fingerPrint) {
      const checkAccount = async () => {
        const hashedFP = web3.utils.keccak256(fingerPrint);
        dispatch({ type: FETCHING, what: "DEVICE_ADDRESS" });
        const account = await meowb.methods.checkAccount(hashedFP).call();
        setDeviceAddress(account);
        if (account === "0x0000000000000000000000000000000000000000") {
          if ((await web3.eth.net.getId()) === GANACHE_ID) {
            const gAddress = await web3.eth.getAccounts();
            await meowb.methods
              .addAccount(hashedFP, gAddress[0])
              .send({ from: gAddress[0] });
            setDeviceAddress(gAddress);
          } else {
            dispatch({ type: FETCHING, what: "CREATING NEW DEVICE ADDRESS" });
            const newAddress = web3.eth.accounts.create();
            setDeviceAddress(newAddress);
            const addA = await meowb.methods.addAccount(
              hashedFP,
              newAddress.address
            );

            // FOR GANACHE TESTING
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
            await web3.eth.sendSignedTransaction(signedT.rawTransaction);
            dispatch({
              type: SUCCESS,
              response: newAddress.address,
              what: "NEW DEVICE ADDRESS"
            });
            // .send({ from: newAddress.address });
          }
        } else {
          dispatch({
            type: SUCCESS,
            response: account,
            what: "DEVICE_ADDRESS"
          });
          setDeviceAddress(account);
        }
      };
      checkAccount();
    }
  }, [fingerPrint]);

  const checkOwner = async qr => {
    dispatch({ type: FETCHING, what: "OWNER" });
    try {
      const response = await meowb.methods.checkOwner(qr).call();
      dispatch({ type: SUCCESS, response, what: "OWNER" });
      dispatch({ type: OWNER, owner: response });
      getTributes();
    } catch (error) {
      dispatch({ type: ERROR, response: error, what: "OWNER" });
    }
  };

  const claimQR = async qr => {
    dispatch({ type: FETCHING, what: "QRCLAIM" });
    try {
      const account = await web3.eth.getAccounts();
      const response = await meowb.methods
        .claimQR(qr[0], qr[1], deviceAddress)
        .send({ from: account[0] });

      if (response.events.MeowError) {
        dispatch({
          type: ERROR,
          response: response.events.MeowError.returnValues[0],
          what: "QRCLAIM"
        });
      } else {
        dispatch({ type: SUCCESS, response: response, what: "QRCLAIM" });
        dispatch({ type: OWNER, owner: deviceAddress });
      }
    } catch (error) {
      dispatch({
        type: ERROR,
        response: "this code is already claimed or does not exist"
      });
    }
  };

  const addQR = async (qr, shape, color) => {
    dispatch({ type: FETCHING, what: "QRADD" });
    dispatch({ type: PRINT_QR, response: null });

    try {
      const account = await web3.eth.getAccounts();
      const response = await meowb.methods
        .addQR(qr, shape, color)
        .send({ from: account[0], gas: 3000000 });
      dispatch({ type: SUCCESS, response: response, what: "QRADD" });
      const QRID = response.events.MeowObjectAddedID.returnValues[0];
      dispatch({ type: "PRINT_QR", response: `${QRID}-${qr}` });
    } catch (err) {
      dispatch({
        type: ERROR,
        response: "something went wrong, this QR probably already exists",
        what: "QRADD"
      });
    }
  };

  const getTributes = async () => {
    dispatch({ type: FETCHING, what: "ATTRIBUTES" });
    const _id = getID();
    try {
      const tributes = await meowb.methods.getTributes(_id).call();
      dispatch({ type: SUCCESS, response: tributes, what: "ATTRIBUTES" });
      dispatch({ type: TRIBUTES, tributes });
      return tributes
    } catch (error) {
      dispatch({ type: ERROR, response: error.message });
    }
  };

  return (
    <Web3Context.Provider
      value={{ state, dispatch, checkOwner, claimQR, addQR, getTributes }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
