import React, {useEffect, useReducer} from "react"
import Web3 from "web3"
import Meowbject from "./contracts/Meowbject"

export const Context = React.createContext()
const blockPoint = "http://localhost:8545"
const address = "0x1386A60A0d45745F95fc496527f1354A50DE1374"
const provider = new Web3.providers.HttpProvider(blockPoint)
const web3 = new Web3(provider)
const meowb = new web3.eth.Contract(Meowbject.abi, address)
// action types
const FETCHING = "FETCHING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR"

const initialState = {response: null, status: null}

const reducer = (state, action) => {
    console.log(state, action)
    const {response, type} = action
    switch(type) {
        case FETCHING:
            return {...state, status:FETCHING}
        case SUCCESS:
            return {...state, status: SUCCESS, response}
        case ERROR:
            return {...state, status: ERROR, response}
        default:
            return state
    }
}

 const makeRequest = async (dispatch) => {
        dispatch({type:FETCHING})
        try {
            const qr = await meowb.methods.qrs(0).call()
            const response = await meowb.methods.checkOwner(qr).call()
            dispatch({type:SUCCESS, response})
        } catch(error) {
            dispatch({type:ERROR, response:error})
        }
    }

const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <Context.Provider value={{state, dispatch, makeRequest}}>
            {children}
        </Context.Provider>
    )
}

export default Provider