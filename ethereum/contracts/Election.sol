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
    struct Voter{
        uint voterId;
        string name;
        address voterAddress;
        bool authenticated;
        bool voted;
    }
    struct Request{
        address reuqestVoterAddress;
        bool accepted;
    }

    address public admin;
    uint public candidateCount;
    string public description;
    string public name;
    uint public winnerId;
    uint public requestCount;
    bool public active;

    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    mapping(uint => Request) requests;
    constructor(address _admin,string memory _name,string memory _desc) public
    {
        active = true;
        name = _name;
        description = _desc;
        admin = _admin;
    }
    // event votedEvent(uint _candidate_id); 
    modifier adminAccess() {
        if(msg.sender != admin)
            revert("User doesn't have Admin privileges");
        _;
    }
    modifier authenticatedVoter(){
        if(!voters[msg.sender].authenticated)
            revert("Voter needs to authenticated first.");
        _;
    }
    modifier eligibleVoter(){
        if(voters[msg.sender].voted)
            revert("User can vote only once!");
        _;
    }
    modifier electionOpen(){
        require(active,"Election is Closed");
        _;
    }
    function addCandidate(string  memory _name) public adminAccess electionOpen
    {
        candidateCount++;
        candidates[candidateCount] =   Candidate(candidateCount,_name,0);
    }
    function vote(uint id) public authenticatedVoter eligibleVoter electionOpen
    {
        // if(id >0 && id <= candidateCount)
        if(id <0 || id > candidateCount)
            revert("Invalid Candidate Id!");
        candidates[id].voteCount++;
        voters[msg.sender].voted = true;
        // emit votedEvent(id);
    }

    function registerVoter(string memory _name) public  electionOpen{
        // require(admin != msg.sender, "Admin can not vote the candidates");
        if(voters[msg.sender].voterId != 0)
            revert("Voter already exist on this account address");
        requestCount++;
        voters[msg.sender] = Voter(requestCount, _name,msg.sender, false, false);
        requests[requestCount] = Request(msg.sender,false);
    }
    function authenticateVoter(uint _id) public adminAccess  electionOpen{
        // require(requests[_id] != 0x0,"Voter has not register or has been approved by Manager.");
        if(voters[requests[_id].reuqestVoterAddress].voterId == 0)
            revert("Voter does not exist in election pool");
        voters[requests[_id].reuqestVoterAddress].authenticated = true;
        requests[_id].accepted = true;
        // delete requests[_id];
    }
    function removeCandidate(uint _candidate_id) public adminAccess electionOpen
    {
        require(candidates[_candidate_id].id != 0,"Candidate does not exist in Election pool!");
        delete candidates[_candidate_id];
    }
    function closeElection() public adminAccess {
        require(candidateCount >= 1, "There should be least one Candidate");
        uint maxVotes = candidates[1].voteCount;
        bool sameVotes = false;
        winnerId = 1;
        for (uint i = 2; i <= candidateCount; i++) {
            if(candidates[i].voteCount == maxVotes)
                sameVotes = true;
            else if (candidates[i].voteCount > maxVotes) {
                winnerId = i;
                sameVotes = false;
                maxVotes = candidates[i].voteCount;
            }
        }
        if(sameVotes)
            revert("Two Candidates have same votes..");
        active = false;
    }
    function getRequests(uint index) public view adminAccess returns (address,bool,string)
    {
        return (requests[index].reuqestVoterAddress,requests[index].accepted,voters[requests[index].reuqestVoterAddress].name);
    }
}