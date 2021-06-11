const web3 = require('./web3');
const compiledFactory = require('./build/ElectionFactory.json')
const instance = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    "0x083afbE532918C8feC1D19bd17479C2FdF7a938c"
);
export default instance;