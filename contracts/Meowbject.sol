pragma solidity >=0.4.21 <0.6.0;

contract Meowbject {
    event MeowbjectAdded(string _message);
    event MeowbjectClaimed(string _message);

    bytes32[] public qrs;
    mapping(bytes32 => address) qrOwnership;
    mapping(uint => bytes32) qrIds;

    struct Meowbjectributes {
        string shape;
    }

    Meowbjectributes[] meowbjectributes;

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
