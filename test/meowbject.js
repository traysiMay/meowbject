const Meowbject = artifacts.require("Meowbject");
const web3 = require("web3");
const QR = "chicken_qr_code";
contract("Meowbject", accounts => {
  it("Local hash should match contract's hash", async () => {
    const meowbjectInstance = await Meowbject.deployed();
    await meowbjectInstance.addQR(QR, "sphere", { from: accounts[0] });
    const localQR = web3.utils.keccak256(QR);
    const meowQR = await meowbjectInstance.qrs.call(0);
    assert.equal(localQR, meowQR, "Keccak hash values match");
  });
  it("Should not have an address mapped to it", async () => {
    const meowbjectInstance = await Meowbject.deployed();
    const meowQR = await meowbjectInstance.checkQR(0);
    const nullAddress = await meowbjectInstance.checkOwner(meowQR);
    assert.equal(nullAddress, 0x0);
  });
  it("Should take ownership of the first QR", async () => {
    const meowbjectInstance = await Meowbject.deployed();
    await meowbjectInstance.claimQR(0, QR, accounts[0]);
    const enQR = await meowbjectInstance.checkQR(0);
    const ownerAddress = await meowbjectInstance.checkOwner(enQR);
    assert.equal(accounts[0], ownerAddress);
  });
  it("Should have the shape of a sphere", async () => {
    const meowbjectInstance = await Meowbject.deployed();
    const tributes = await meowbjectInstance.getTributes(0);
    console.log(tributes);
    assert.equal(tributes, "sphere");
  });
});
