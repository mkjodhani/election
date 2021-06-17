const ElectionFactory = require("../ethereum/build/ElectionFactory.json");
const Election = require("../ethereum/build/Election.json");
const web3 = require('../ethereum/web3')
const assert = require("assert");

let accounts, electionFactory;

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
});

describe("Election Factory Testing", () => {
  it("Creating Election...", async () => {

    const _name = "mkjodhani",
      _desc = "mkjodhani Description";

    await electionFactory.methods.addElection(_name, _desc).send({
      from: accounts[0],
      gas: "3000000",
    });

    const eleAddr = await electionFactory.methods.elections(1).call();
    const election = await new web3.eth.Contract(
      JSON.parse(Election.interface),
      eleAddr
    );
    const admin = await election.methods.admin().call();
    const candidateCount = await election.methods.candidateCount().call();
    const description = await election.methods.description().call();
    const name = await election.methods.name().call();
    assert.strictEqual(_name, name);
    assert.strictEqual(_desc, description);
    assert.strictEqual(candidateCount, "0");
    assert.strictEqual(admin, accounts[0]);
  });
  it("Removing Election....", async () => {
    const _name = "mkjodhani",
      _desc = "mkjodhani Description";
    await electionFactory.methods.addElection(_name, _desc).send({
      from: accounts[0],
      gas: "3000000",
    });
    await electionFactory.methods.removeElection(1).send({
      from: accounts[0],
      gas: "3000000",
    });
    const eleAddr = await electionFactory.methods.elections(1).call();
    const election = await new web3.eth.Contract(
      JSON.parse(Election.interface),
      eleAddr
    );
    try {
      await election.methods.admin().call();
      assert(false);
    } catch (error) {
      assert(true);
    }
  });
  it("can remove Election only once", async () => {
    const _name = "mkjodhani",
      _desc = "mkjodhani Description";
    await electionFactory.methods.addElection(_name, _desc).send({
      from: accounts[0],
      gas: "3000000",
    });
    await electionFactory.methods.removeElection(1).send({
      from: accounts[0],
      gas: "3000000",
    });
    try {
      await electionFactory.methods.removeElection(1).send({
        from: accounts[0],
        gas: "3000000",
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });  
});
