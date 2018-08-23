pragma solidity ^0.4.23;


contract SimpleStorage {

    uint constant public MAX_LEN = 16;    
    mapping(address => address) private prev;
    mapping(address => address) private next;
    mapping(uint => address[]) private knots;
    
    address private gm;
    bool private ended;
    uint private ts;
    
    constructor() public {
        gm = msg.sender;
    }

    // Test
    function addDummy(address[] _addrs) public {
        for (uint i = 0; i < _addrs.length; i++) {
            knots[knotNumber(_addrs[i])].push(_addrs[i]);
            prev[_addrs[i]] = gm;
        }
    }

    //

    modifier ongoing() {
        require(!ended, "The game has ended");
        _;
    }

    modifier gameMaster() {
        require(gm == msg.sender, "Game master only");
        _;
    }

    function stop() gameMaster public {
        ended = true;
    }

    // action functions
    function checkin() ongoing public {
        require(msg.sender != gm, "Game master can not play");
        require(!isPlayer(msg.sender), "Already checked in");
        knots[knotNumber(msg.sender)].push(msg.sender);
        prev[msg.sender] = gm;
    }
    
    function joint(address _to) ongoing public returns (bool) {
        require(isPlayer(msg.sender), "Must checkin before play");
        require(isPlayer(_to), "Must connect to a joined address");
        if (knotNumber(msg.sender) == knotNumber(_to) + 1) {
            prev[msg.sender] = _to;
            return true;
        }
        if (knotNumber(msg.sender) == knotNumber(_to) - 1) {
            next[msg.sender] = _to;
            return true;
        }
        return false;
    }

    // get info functions
    function playerInfo(address _addr) public view returns (bool joined, uint knot, address left, address right, uint len) {
        joined = isPlayer(_addr);
        if (!joined) return;
        knot = knotNumber(_addr);
        left = prev[_addr] != gm ? prev[_addr] : 0;
        right = next[_addr];
        len = bambooLen(_addr);
    }

    function isPlayer(address _addr) public view returns (bool) {
        return prev[_addr] != 0;
    }

    function knotNumber(address _addr) public pure returns (uint) {
        bytes32 b = bytes32(uint256(_addr) << 96);
        return (uint(b[2]) * 256 + uint(b[6])) % MAX_LEN;
    }

    function bambooLen(address _addr) public view returns (uint) {
        uint rs = 1;
        address cur = _addr;
        while (next[prev[cur]] == cur) {
            cur = prev[cur];
            rs++;
        }
        cur = _addr;
        while (prev[next[cur]] == cur) {
            cur = next[cur];
            rs++;
        }
        return rs;
    }

    // supported function
    function knotsByNum(uint _num) public view returns (address[]) {
        return knots[_num];
    }

    // function getBestSpan() public view returns (uint) {
    //     uint maxLen;
    //     address winnerSpan;
    //     for (uint i = 0; i < attendees.length; i++) {
    //         if (prev[attendees[i]] == 0) {
    //             uint len = getSpanLen(attendees[i]);
    //         }
    //     }
    // }


}
