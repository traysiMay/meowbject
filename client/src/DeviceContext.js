import React, { useEffect, useState } from "react";
import Fingerprint2 from "fingerprintjs2";
export const DeviceContext = React.createContext();

const DeviceProvider = ({ children }) => {
  const [fingerPrint, setFingerPrint] = useState();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const getFingerPrint = () => {
      if (window.requestIdleCallback) {
        requestIdleCallback(function() {
          Fingerprint2.get(function(components) {
            var values = components.map(function(component) {
              return component.value;
            });
            var murmur = Fingerprint2.x64hash128(values.join(""), 31);
            setFingerPrint(murmur);
          });
        });
      } else {
        setTimeout(function() {
          Fingerprint2.get(function(components) {
            var values = components.map(function(component) {
              return component.value;
            });
            var murmur = Fingerprint2.x64hash128(values.join(""), 31);
            setFingerPrint(murmur);
          });
        }, 500);
      }
    };
    getFingerPrint();
  }, []);

  return (
    <DeviceContext.Provider value={{ fingerPrint, admin, setAdmin }}>
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceProvider;
