const qrIndex = process.env.NODE_ENV === "development" ? 1 : 2;
const qr = window.location.search.split("=")[1].split("-");
console.log(qrIndex);
export const GANACHE_ID = 1569465605456;
export const KALE_ID = 1158070613;
export const isOwned = address =>
  address === "0x0000000000000000000000000000000000000000" ? false : true;
export const getQR = () => qr[1];
export const getID = () => qr[0];
