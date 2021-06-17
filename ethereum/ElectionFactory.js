const web3 = require('./web3');
const compiledFactory = require('./build/ElectionFactory.json')
const ElectionFactory = new web3.eth.Contract(JSON.parse(compiledFactory.interface),"0xd630553eEB756B499F1e0aDFb278107C04630914");
module.exports =  ElectionFactory;