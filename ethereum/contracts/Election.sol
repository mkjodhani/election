// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;
contract ElectionFactory
{
    address public manager;
    mapping(uint=>address) public elections;
    uint public totalElections;
    constructor() public
    {
        manager = msg.sender;
    }
    modifier managerAccess(){
        require(msg.sender == manager);
        _;
    }
    // event electionAdded(address addr);
    // event electionDeleted(address addr);
    function addElection(string memory _name,string memory _desc) public 
    {
        address election = address(new Election(msg.sender,_name,_desc));
        totalElections++;
        elections[totalElections] = election;
        // emit electionAdded(election);
    } 
    function removeElection(uint id) public managerAccess
    {
        require(id >0 && id <= totalElections,"Invalid Election Id!");
        require(elections[id] != 0x0 ,"Election doesn't exists.");
        // emit electionDeleted(elections[id]);
        delete elections[id];
    }
}
contract Election
{
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    address public admin;
    uint public candidateCount;
    string public description;
    string public name;
    mapping(address=>bool) public voters;
    mapping(uint => Candidate) public candidates;
    
    constructor(address _admin,string memory _name,string memory _desc) public
    {
        name = _name;
        description = _desc;
        admin = _admin;
    }
    event votedEvent(uint _candidate_id); 
    
    function addCandidate(string  memory _name) public
    {
        require(msg.sender == admin,"Only Admin can add Candidate");
        candidateCount++;
        candidates[candidateCount] =   Candidate(candidateCount,_name,0);
    }
    function vote(uint id) public 
    {
        require(admin != msg.sender,"Admin can not vote the candidates");
        require(!voters[msg.sender],"User can vote only once!");
        require(id >0 && id <= candidateCount,"Invalid Candidate Id!");
        candidates[id].voteCount++;
        voters[msg.sender] = true;
        // emit votedEvent(id);
    }
}