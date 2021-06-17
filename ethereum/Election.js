const web3 = require('./web3');
const compiledElection = require('./build/Election.json')
module.exports = (address)=>{
    const election  = new web3.eth.Contract(JSON.parse(compiledElection.interface),address);
    return election;
}