const web3 = require('./web3');
const compiledFactory = require('./build/ElectionFactory.json')
const ElectionFactory = new web3.eth.Contract(JSON.parse(compiledFactory.interface),"0xCed71BF565Ab6f2dB8592293C35FbFFF9D034C44");
module.exports =  ElectionFactory;