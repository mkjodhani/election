const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider("------------------put the twelve word key of metamask------------------","------------------infura blockchain node's url------------------");
const web3 = new Web3(provider);
const ElectionFactory = require('./build/ElectionFactory.json');

(async () =>{
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account :',accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(ElectionFactory.interface))
    .deploy({data:ElectionFactory.bytecode})
    .send({
        from:accounts[0],
        gas:1000000
    });
    console.log('Contarct Deployed to ' + result.options.address);
})();