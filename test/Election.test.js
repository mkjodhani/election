const ElectionFactory = require("../ethereum/build/ElectionFactory.json");
const Election = require("../ethereum/build/Election.json");
const web3 = require("../ethereum/web3");
const assert = require("assert");

let accounts, electionFactory, election,admin;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    electionFactory = await new web3.eth.Contract(JSON.parse(ElectionFactory.interface))
        .deploy({
            data: ElectionFactory.bytecode,
        })
        .send({
            from: accounts[0],
            gas: "3000000",
        });
    await electionFactory.methods
        .addElection("mkjodhani", "mkjodhani Description")
        .send({
            from: accounts[1],
            gas: "3000000",
        });
    const eleAddr = await electionFactory.methods.elections(1).call();
    election = await new web3.eth.Contract(
        JSON.parse(Election.interface),
        eleAddr
    );
    admin = await election.methods.admin().call();
});

describe("Election Testing", () => {
    it("Create Request for Voter", async () => {
        const _voterName = "bhalani";
        assert.strictEqual(accounts[1],admin);
        await election.methods.registerVoter(_voterName).send({
            from: accounts[2],
            gas: "3000000", //simple voter address
        });
        const request = await election.methods.getRequests(1).call({
            from: accounts[1], //Election admin address
        });

        voter = await election.methods.voters(request["0"]).call();
        assert.strictEqual(voter['voterId'],'1')
        assert.strictEqual(voter['name'],_voterName)
        assert.strictEqual(voter['voterAddress'],accounts[2])
        assert.strictEqual(voter['authenticated'],false)
        assert.strictEqual(voter['voted'],false)
        assert.strictEqual(request["1"], false);
        assert.strictEqual(request["0"], accounts[2]);
    });
    it("Acccept Request From Voter", async () => {
        const _voterName = "bhalani";
        await election.methods.registerVoter(_voterName).send({
            from: accounts[2],      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(1).send({
            from: accounts[1],
        });
        const request = await election.methods.getRequests(1).call({
            from: accounts[1],
        });
        voter = await election.methods.voters(request["0"]).call();
        assert.strictEqual(voter['voterId'],'1')
        assert.strictEqual(voter['name'],_voterName)
        assert.strictEqual(voter['voterAddress'],accounts[2])
        assert.strictEqual(voter['authenticated'],true)
        assert.strictEqual(voter['voted'],false)
        assert.strictEqual(request["1"], true);
    });
    it("Adding Candidate to Election", async () => {
        const _candidateName = "mkjodhani";
        await election.methods.addCandidate(_candidateName).send({
          from: accounts[1],
          gas: "3000000",
        });
        const cand = await election.methods.candidates(1).call();
        assert.strictEqual(_candidateName, cand["name"]);
        assert.strictEqual("1", cand["id"]);
        assert.strictEqual("0", cand["voteCount"]);
      });

    it("Give Vote to Candidate", async () => {
        const _voterName = "bhalani",_candidateName = "mkjodhani";
        await election.methods.addCandidate(_candidateName).send({
          from: accounts[1],
          gas: "3000000",
        });
        await election.methods.registerVoter(_voterName).send({
            from: accounts[2],      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(1).send({
            from: accounts[1],
        });

        await election.methods.vote(1).send({
            from: accounts[2],
        });

        const cand = await election.methods.candidates(1).call();
        assert.strictEqual(_candidateName, cand["name"]);
        assert.strictEqual("1", cand["voteCount"]);
    });
    it("Finalize the Result", async () => {
        const _voterNames = ["Mansi","Riya","Prashant","Isha"];
        const _candidateNames = ["bhalani","mkjodhani"];
        const _candidates = _candidateNames.map((name,i) => {return {"id":i+1,"name":name }});
        const _voters = _voterNames.map((name,i) => {return {"id":i+1,"name":name ,"address":accounts[i+2]}});
        //candidate added
        await election.methods.addCandidate(_candidateNames[0]).send({
            from: accounts[1],
            gas: "3000000",
            });
        await election.methods.addCandidate(_candidateNames[1]).send({
        from: accounts[1],
        gas: "3000000",
        });

        // _candidates.map(async (cand) =>
        // {
        //     console.log(cand);
        //     await election.methods.addCandidate(cand.name).send({
        //       from: accounts[1],
        //       gas: "3000000",
        //     });
        // })
        var cand1 = await election.methods.candidates(1).call();
        var cand2 = await election.methods.candidates(2).call();
        // console.log("---------------------CAndidate-----------------");
        // console.log(cand1,cand2);
        //First Voter
        var person = _voters[0];
        await election.methods.registerVoter(person.name).send({
            from: person.address,      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(person.id).send({
            from: accounts[1],  //Election Admin
        });
        await election.methods.vote(1).send({
            from: person.address,
        });

        //Second Voter
        person = _voters[1];
        await election.methods.registerVoter(person.name).send({
            from: person.address,      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(person.id).send({
            from: accounts[1],  //Election Admin
        });
        await election.methods.vote(1).send({
            from: person.address,
        });
        
        //Third Voter
        person = _voters[2];
        await election.methods.registerVoter(person.name).send({
            from: person.address,      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(person.id).send({
            from: accounts[1],  //Election Admin
        });
        await election.methods.vote(1).send({
            from: person.address,
        });
        
        //Forth Voter
        person = _voters[3];
        await election.methods.registerVoter(person.name).send({
            from: person.address,      //Voter Address
            gas: "3000000",
        });
        await election.methods.authenticateVoter(person.id).send({
            from: accounts[1],  //Election Admin
        });
        await election.methods.vote(2).send({
            from: person.address,
        });
        
        // voters.map(async (person) => {
        //     console.log(person);
        //     await election.methods.registerVoter(person.name).send({
        //         from: person.address,      //Voter Address
        //         gas: "3000000",
        //     });
        //     await election.methods.authenticateVoter(person.id).send({
        //         from: accounts[1],  //Election Admin
        //     });
        //     await election.methods.vote(1).send({
        //         from: person.address,
        //     });
        // })

        // console.log("-------------------------VOter------------------------");
        // _voterNames.map(async (name,i) => {
        //     voter = await election.methods.voters(accounts[i+2]).call();
        //     console.log(voter);          
        // })

        cand1 = await election.methods.candidates(1).call();
        cand2 = await election.methods.candidates(2).call();
        // console.log(cand1,cand2);
        assert.strictEqual(_candidateNames[0], cand1["name"]);
        assert.strictEqual("3", cand1["voteCount"]);

        assert.strictEqual(_candidateNames[1], cand2["name"]);
        assert.strictEqual("1", cand2["voteCount"]);
        
        await election.methods.closeElection().send({
            from: accounts[1],
            gas: "3000000",
        });
        const winnerId = await election.methods.winnerId().call();
        assert.strictEqual('1', winnerId);
    });

});
async function makeVoter(person){
    await election.methods.registerVoter(person.name).send({
        from: person.address,      //Voter Address
        gas: "3000000",
    });
    await election.methods.authenticateVoter(person.id).send({
        from: accounts[1],  //Election Admin
    });
    await election.methods.vote(1).send({
        from: person.address,
    });
}