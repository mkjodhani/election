const Web3 = require('web3')
const HDWalletProvider = require('truffle-hdwallet-provider');
const provider = new HDWalletProvider("tissue like claw draft begin impulse speed online exact purity measure letter","https://rinkeby.infura.io/v3/281808df56034ff6bcba3da70667f4cd");
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