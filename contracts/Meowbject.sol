pragma solidity >=0.4.21 <0.6.0;

contract Meowbject {
    event MeowbjectAdded(string _message);
    event MeowbjectClaimed(string _message);

    mapping(bytes32 => address) accounts;

    bytes32[] public qrs;
    mapping(bytes32 => address) qrOwnership;
    mapping(uint => bytes32) qrIds;

    struct Meowbjectributes {
        string shape;
    }

    Meowbjectributes[] meowbjectributes;

    function addAccount(bytes32 _device, address _address) public {
        require(accounts[_device] == address(0), "this device is already registered");
        accounts[_device] = _address;
    }

    function checkAccount(bytes32 _device) public view returns (address account) {
        return accounts[_device];
    }

    function addQR(string memory _qr, string memory _tributes) public {
        bytes32 hashedQR = keccak256(abi.encodePacked(_qr));
        qrIds[qrs.length] = hashedQR;
        qrs.push(hashedQR);
        Meowbjectributes memory _meowbjectributes = Meowbjectributes({shape: _tributes});
        meowbjectributes.push(_meowbjectributes);
        emit MeowbjectAdded("QR stored successfully!!");
    }

    function claimQR(uint _id, string memory _qr, address _sender) public {
        bytes32 hashedQR = keccak256((abi.encodePacked(_qr)));
        bytes32 pQR = qrs[_id];
        require(pQR == hashedQR, "this is not a valid qr my dude");
        require(qrOwnership[hashedQR] == address(0), "this qr code is taken");
        qrOwnership[hashedQR] = _sender;
        emit MeowbjectClaimed('QR claimed!');
    }

    function checkQR(uint _id) public view returns (bytes32 qr) {
        return qrIds[_id];
    }

    function checkOwner(bytes32 _qr) public view returns (address owner) {
        return qrOwnership[_qr];
    }

    function getTributes(uint _id) public view returns (string memory tributes) {
        Meowbjectributes memory _tributes = meowbjectributes[_id];
        return _tributes.shape;
    }
}
