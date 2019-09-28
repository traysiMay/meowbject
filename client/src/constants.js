export const GANACHE_ID = 1569686899907
export const isOwned = (address) => address === "0x0000000000000000000000000000000000000000" ? false : true
export const getQR = () => window.location.pathname.split("/")[1].split("-")[1];
export const getID = () => window.location.pathname.split("/")[1].split("-")[0];
