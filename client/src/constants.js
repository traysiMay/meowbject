
const qr = window.location.search ? window.location.search.split('?')[1].split("-") : [1, "null_object"];
export const GANACHE_ID = 1569465605456;
export const KALE_ID = 1158070613;
export const isOwned = address =>
    address === "0x0000000000000000000000000000000000000000" ? false : true;
export const getQR = () => qr[1];
export const getID = () => qr[0];
