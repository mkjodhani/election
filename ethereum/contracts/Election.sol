// SPDX-License-Identifier: MIT
pragma solidity ^0.4.26;
contract ElectionFactory
{
    address manager;
    address[] public elections;
    constructor() public
    {
        manager = msg.sender;
    }
    modifier managerAccess(){
        require(msg.sender == manager);
        _;
    }
    function addElection(string memory _desc) public managerAccess
    {
        address election = address(new Election(_desc));
        elections.push(election);
    } 
    function removeElection(uint id) public managerAccess
    {
        delete elections[id];
    }
}
contract Election
{
    address public admin;
    uint public candidateCount;
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    string public description;
    mapping(address=>bool) public voters;
    mapping(uint => Candidate) public candidates;
    constructor(string memory _desc) public
    {
        description = _desc;
        admin = msg.sender;
    }
    event votedEvent(uint _candidate_id); 
    
    function addCandidate(string  memory _name) public
    {
        require(msg.sender == admin,"Only Admin can add Candidate");
        candidateCount++;
        candidates[candidateCount] =  Candidate(candidateCount,_name,0);
    }
    function vote(uint id) public 
    {
        require(admin != msg.sender,"Admin can not vote the candidates");
        require(!voters[msg.sender],"User can vote only once!");
        require(id>0 && id<=candidateCount,"Invalid Candidate Id!");
        candidates[id].voteCount++;
        voters[msg.sender] = true;
        emit votedEvent(id);
    }
}