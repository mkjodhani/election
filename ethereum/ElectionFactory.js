const web3 = require('./web3');
const compiledFactory = require('./build/ElectionFactory.json')
const ElectionFactory = new web3.eth.Contract(JSON.parse(compiledFactory.interface),"0x1c1aE8d3a1376773c12fF7BBb7E1cDC5acC99326");
console.log("factory.......");
module.exports =  ElectionFactory;