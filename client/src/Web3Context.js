import React, { useContext, useEffect, useReducer, useState } from "react";
import Web3 from "web3";
import Meowbject from "./contracts/Meowbject";
import { DeviceContext } from "./DeviceContext";
import { GANACHE_ID, getQR, getID } from "./constants";

export const Web3Context = React.createContext();

// const KALE_A = "u1qhdnj7go";
// const KALE_B = "c2uiuaT6hOXr545x90ghGWiuwFC_rLhCTlV0wacrO-k";
// const RPC = "u1wxxj5g51-u1ghyojs49-rpc.us1-azure.kaleido.io";

const blockPoint = "http://localhost:8545";
const wssBP = "ws://localhost:8545"
// const blockPoint = `https://${KALE_A}:${KALE_B}@${RPC}`;

// const address = "0x64051eB06dC09432944012bB3Ac92E5107e48bBe";

const address = Meowbject.networks["1569686899907"].address
const provider = new Web3.providers.HttpProvider(blockPoint);
const wsprovider = new Web3.providers.WebsocketProvider(wssBP)
const wweb3 = new Web3(wsprovider)
const web3 = new Web3(provider);
window.web3 = web3;
const meowb = new web3.eth.Contract(Meowbject.abi, address);

// action types
const FETCHING = "FETCHING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const OWNER = "OWNER"
const TRIBUTES = "TRIBUTES"
window.web3 = web3;
window.meow = meowb;
const initialState = { fetcher: { response: null, status: null }, ownership: { owner: null }, tributes: { tributes: null } };

const reducer = (state, action) => {
  const { response, type, owner, tributes } = action;
  switch (type) {
    case FETCHING:
      return { ...state, fetcher: { status: FETCHING } };
    case SUCCESS:
      return { ...state, fetcher: { status: SUCCESS, response } };
    case ERROR:
      return { ...state, fetcher: { status: ERROR, response } };
    case OWNER:
      return { ...state, ownership: { owner } }
    case TRIBUTES: {
      return { ...state, tributes: { tributes } }
    }
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
          if (await web3.eth.net.getId() === GANACHE_ID) {
            const gAddress = await web3.eth.getAccounts()
            await meowb.methods.addAccount(hashedFP, gAddress[0]).send({ from: gAddress[0] })
            setDeviceAddress(gAddress)
          } else {
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
            const tranny = await web3.eth.sendSignedTransaction(
              signedT.rawTransaction
            );
            // .send({ from: newAddress.address });
          }

        }
      };
      checkAccount();
    }
  }, [fingerPrint]);

  useEffect(() => {
    let subscribedEvents = {}
    const subscribeLogEvent = (contract, eventName) => {
      const eventJsonInterface = web3.utils._.find(
        contract._jsonInterface,
        o => o.name === eventName && o.type === 'event',
      )
      const subscription = wweb3.eth.subscribe('logs', {
        address: contract.options.address,
        topics: [eventJsonInterface.signature]
      }, (error, result) => {
        if (!error) {
          const eventObj = web3.eth.abi.decodeLog(
            eventJsonInterface.inputs,
            result.data,
            result.topics.slice(1)
          )
          console.log(`New ${eventName}!`, eventObj)
          console.log(getQR())
          setTimeout(() => checkOwner(web3.utils.keccak256(getQR()), 1000))
        }
      })
      subscribedEvents[eventName] = subscription
    }

    subscribeLogEvent(meowb, "MeowbjectAdded")
    subscribeLogEvent(meowb, "MeowbjectClaimed")
  }, [])

  const checkOwner = async qr => {
    console.log('check owner')
    dispatch({ type: FETCHING });
    try {
      const response = await meowb.methods.checkOwner(qr).call();
      dispatch({ type: SUCCESS, response });
      dispatch({ type: OWNER, owner: response })
      getTributes()
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

  const getTributes = async () => {
    dispatch({ type: FETCHING });
    const _id = getID()
    console.log(_id)
    try {
      const tributes = await meowb.methods.getTributes(_id).call()
      console.log(tributes)
      dispatch({ type: SUCCESS, response: tributes });
      dispatch({ type: TRIBUTES, tributes })
    } catch (error) {
      dispatch({ type: ERROR, response: error.message });
    }
  }

  return (
    <Web3Context.Provider value={{ state, dispatch, checkOwner, claimQR }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
