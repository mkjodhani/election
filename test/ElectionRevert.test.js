const ElectionFactory = require("../ethereum/build/ElectionFactory.json");
const Election = require("../ethereum/build/Election.json");
const web3 = require("../ethereum/web3");
const assert = require("assert");

let accounts, electionFactory, election, admin;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  electionFactory = await new web3.eth.Contract(
    JSON.parse(ElectionFactory.interface)
  )
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

describe("Election Revert Testing", () => {
  it("Transaction Revert: Create Request for Voter twise for Same User", async () => {
    const _voterName = "bhalani";
    assert.strictEqual(accounts[1],admin);
    await election.methods.registerVoter(_voterName).send({
        from: accounts[2],
        gas: "3000000", //simple voter address
    });
    try {
      await election.methods.registerVoter(_voterName).send({
        from: accounts[2],
        gas: "3000000", //simple voter address
    });
    assert(false)
    } catch (error) {
      assert(true)
    }

});
  it("Transaction Revert: restricting Voter votes Candidate without register.", async () => {
    const _candidateName = "bhalani";
    await election.methods.addCandidate(_candidateName).send({
      from: accounts[1],
      gas: "3000000",
    });
    try {
      await election.methods.vote(1).send({
        from: accounts[2],
        gas: "3000000",
      });
      assert(
        false,
        "should not be able to vote while voter is not registered into System"
      );
    } catch (error) {
      const cand = await election.methods.candidates(1).call();
      assert.strictEqual("0", cand["voteCount"]);
      assert(true);
      // assert.strictEqual(error.message === "VM Exception while processing transaction: revert Voter needs to authenticated first.");
    }
  });

  it("Transaction Revert: Registered voter votes Candidate without being authenticate.", async () => {
    const _candidateName = "bhalani",
      _voter = "Meet";
    await election.methods.addCandidate(_candidateName).send({
      from: accounts[1],
      gas: "3000000",
    });
    await election.methods.registerVoter(_voter).send({
      from: accounts[2], //Voter Address
      gas: "3000000",
    });
    try {
      await election.methods.vote(1).send({
        from: accounts[2], //Voter Address
      });
      assert(
        false,
        "should not be able to vote while voter is not authenticated by Admin"
      );
    } catch (error) {
      const cand = await election.methods.candidates(1).call();
      assert.strictEqual("0", cand["voteCount"]);
      assert(true);
    }
  });

  it("Transaction Revert: Voter votes Candidate who is not registered.", async () => {
    const _voterNames = ["Mansi", "Riya", "Prashant", "Isha"];
    const _voters = _voterNames.map((name, i) => {
      return { id: i + 1, name: name, address: accounts[i + 2] };
    });

    // Voter
    var person = _voters[0];
    await election.methods.registerVoter(person.name).send({
      from: person.address, //Voter Address
      gas: "3000000",
    });
    await election.methods.authenticateVoter(person.id).send({
      from: accounts[1], //Election Admin
    });
    try {
      await election.methods.vote(1).send({
        from: person.address,
      });
      assert(false, "Candidate is not registerd");
    } catch (error) {
      const voter = await election.methods.voters(person.address).call();
      assert.strictEqual(person.name, voter["name"]);
      assert.strictEqual(false, voter["voted"]);
      assert(true, "Test is not Successful");
    }
  });
  it("Transaction Revert: Voter votes after Election Closed.", async () => {
    const _voterNames = ["Mansi", "Riya", "Prashant", "Isha"];
    const _candidateNames = ["bhalani", "mkjodhani"];
    const _voters = _voterNames.map((name, i) => {
      return { id: i + 1, name: name, address: accounts[i + 2] };
    });

    //candidates added
    await election.methods.addCandidate(_candidateNames[0]).send({
      from: accounts[1],
      gas: "3000000",
    });
    await election.methods.addCandidate(_candidateNames[1]).send({
      from: accounts[1],
      gas: "3000000",
    });

    var cand1 = await election.methods.candidates(1).call();
    var cand2 = await election.methods.candidates(2).call();
    //First Voter
    var person = _voters[0];
    await election.methods.registerVoter(person.name).send({
      from: person.address, //Voter Address
      gas: "3000000",
    });
    await election.methods.authenticateVoter(person.id).send({
      from: accounts[1], //Election Admin
    });
    await election.methods.vote(1).send({
      from: person.address,
    });
    await election.methods.closeElection().send({
      from: accounts[1],
      gas: "3000000",
    });
    const winnerId = await election.methods.winnerId().call();
    assert.strictEqual("1", winnerId);

    const _voterName = "Mansi";

    try {
      await election.methods.registerVoter(_voterName).send({
        from: accounts[5], //Voter Address
        gas: "3000000",
      });
      await election.methods.authenticateVoter(2).send({
        from: accounts[1],
      });
      await election.methods.vote(1).send({
        from: accounts[5],
      });
      assert(false);
    } catch (error) {
      assert(true,"Election is Closed");
    }

    const cand = await election.methods.candidates(2).call();
    assert.strictEqual(_candidateNames[1], cand["name"]);
    assert.strictEqual("0", cand["voteCount"]);
  });
});
