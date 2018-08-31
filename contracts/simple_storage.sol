pragma solidity ^0.4.23;


contract SimpleStorage {

    uint constant public MAX_LEN = 8;    
    mapping(address => address) private prev;
    mapping(address => address) private next;
    mapping(address => uint) private ts;
    mapping(uint => address[]) private knots;
    
    address private gm;
    bool private ended;
    uint private jointCount;
    
    constructor() public {
        gm = msg.sender;
    }

    // For test only
    function addDummy(address[] _addrs) gameMaster public {
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
            ts[msg.sender] = jointCount++;
            return true;
        }
        if (knotNumber(msg.sender) == knotNumber(_to) - 1) {
            next[msg.sender] = _to;
            ts[msg.sender] = jointCount++;
            return true;
        }
        return false;
    }

    // get info functions
    function gameInfo() public view returns (uint maxLength, bool stopped) {
        maxLength = MAX_LEN;
        stopped = ended;
    }

    function playerInfo(address _addr) public view returns (bool joined, bool master, uint knot, address left, address right, uint length) {
        master = (gm == msg.sender);
        if (master) return;
        joined = isPlayer(_addr);
        if (!joined) return;
        knot = knotNumber(_addr);
        left = prev[_addr] != gm ? prev[_addr] : 0;
        right = next[_addr];
        (length, ) = bambooLength(_addr);
        return;
    }

    function isPlayer(address _addr) public view returns (bool) {
        return prev[_addr] != 0;
    }

    function knotNumber(address _addr) public pure returns (uint) {
        bytes32 b = bytes32(uint256(_addr) << 96);
        return (uint(b[2]) * 256 + uint(b[6])) % MAX_LEN;
    }

    function bambooLength(address _addr) public view returns (uint length, uint maxTs) {
        length = 1;
        address cur = _addr;
        maxTs = ts[cur];
        while (next[prev[cur]] == cur) {
            cur = prev[cur];
            if (maxTs < ts[cur]) maxTs = ts[cur];
            length++;
        }
        cur = _addr;
        while (prev[next[cur]] == cur) {
            cur = next[cur];
            if (maxTs < ts[cur]) maxTs = ts[cur];
            length++;
        }
        return;
    }

    // supported function
    function knotsByNumber(uint _num) public view returns (address[]) {
        return knots[_num];
    }

    function winner() public view returns (address) {
        uint winnerLength = 0;
        uint winnerMaxTs = 0;
        address winnerLeftMost;
        for (uint i = 0; i < MAX_LEN; i++) {
            for (uint j = 0; j < knots[i].length; j++) {
                if (prev[knots[i][j]] == gm || next[prev[knots[i][j]]] != knots[i][j]) {
                    uint length;
                    uint maxTs;
                    (length, maxTs) = bambooLength(knots[i][j]);
                    if (length > winnerLength || (length == winnerLength && maxTs < winnerMaxTs)) {
                        winnerLength = length;
                        winnerMaxTs = maxTs;
                        winnerLeftMost = knots[i][j]; 
                    }
                }
            }
        }
        return winnerLeftMost;
    }
}
