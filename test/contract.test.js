const assert = require('assert')
const web3 = require('../ethereum/web3');
const compiledFactory = require('../ethereum/build/ElectionFactory.json');
const compiledElection = require('../ethereum/build/Election.json')
let electionFactory;
let accounts;
beforeEach( async () =>
{
    accounts = await web3.eth.getAccounts();
    electionFactory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],gas:'1000000'});
})
describe('Election Factory Testing',async ()=>{
    it('First Test',async ()=>
    {
        const addr = await electionFactory.methods.manager().call();
        assert.strictEqual(addr,accounts[0])
    })
    it('Adding an Election',async ()=>
    {
        const descInput =  "Description for the Election";
        const nameInput =  "Name for the Election";
        const addr = await electionFactory.methods.addElection(nameInput,descInput).send({
            from:accounts[0],gas:'1000000'
        });
        const addressElection = await electionFactory.methods.elections(0).call();
        const election = new web3.eth.Contract(JSON.parse(compiledElection.interface),addressElection);
        // const desc = await election.methods.description().call();
        // const name = await election.methods.name().call();
        // assert.strictEqual(descInput,desc,"Description is right");
        // assert.strictEqual(nameInput,name,'Name is right');
    })
    // it('can remove an Election only once',async ()=>
    // {
    //     const descInput =  "Description for the Election",nameInput =  "Name for the Election";
    //     await electionFactory.methods.addElection(nameInput,descInput).send({
    //         from:accounts[0],gas:'1000000'
    //     });
    //     const addressElection = await electionFactory.methods.elections(0).call();
    //     const election = new web3.eth.Contract(JSON.parse(compiledElection.interface),addressElection);
    //     assert.ok(election);
    //     await electionFactory.methods.removeElection(1).send({
    //         from:accounts[0],gas:'1000000'
    //     });
    //     try {
    //         await electionFactory.methods.removeElection(1).send({
    //             from:accounts[0],gas:'1000000'
    //         });
    //         assert(false);    
    //     } catch (error) {
    //         assert(true);   
    //     }
    // });
    // it('Adding Candidate to Election',async ()=>
    // {
    //     const descInput =  "Description for the Election",nameInput =  "Name for the Election";
    //     await electionFactory.methods.addElection(nameInput,descInput).send({
    //         from:accounts[0],gas:'1000000'
    //     });
    //     const addressElection = await electionFactory.methods.elections(0).call();
    //     const election = new web3.eth.Contract(JSON.parse(compiledElection.interface),addressElection);
    //     const candidateName = "mkjodhani";
    //     await election.methods.addCandidate(candidateName).send({
    //         from:accounts[0],gas:"1000000"
    //     })
    //     const cand = await election.methods.candidates(1).call();
    //     assert.strictEqual(candidateName ,cand['name']);
    //     assert.strictEqual('1' ,cand['id']);
    //     assert.strictEqual('0' ,cand['voteCount']);
    // });
    // it('voting Candidate to Election',async ()=>
    // {
    //     const descInput =  "Description for the Election",nameInput =  "Name for the Election";
    //     await electionFactory.methods.addElection(nameInput,descInput).send({
    //         from:accounts[0],gas:'1000000'
    //     });
    //     const addressElection = await electionFactory.methods.elections(0).call();
    //     const election = new web3.eth.Contract(JSON.parse(compiledElection.interface),addressElection);
    //     const candidateName = "mkjodhani";
    //     await election.methods.addCandidate(candidateName).send({
    //         from:accounts[0],gas:"1000000"
    //     })
    //     await election.methods.vote(1).send({
    //         from:accounts[1],gas:"1000000"
    //     })
    //     const cand = await election.methods.candidates(1).call();
    //     assert.strictEqual('1' ,cand['voteCount']);
    // })
});