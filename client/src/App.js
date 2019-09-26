import React, {useContext, useEffect} from 'react';
import { Context } from './Context';

function App() {
  const {dispatch, makeRequest, state} = useContext(Context)
const {pathname: qr} = window.location
console.log(qr)
  useEffect(() => {
    makeRequest(dispatch)
  },[])

  return (
    <div>
{JSON.stringify(state)}
    </div>
  );
}

export default App;
