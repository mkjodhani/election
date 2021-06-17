const Web3 = require('web3')
let web3;
const provider =  new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/a25c5c902e7347c68aec3ee67eb014ae");
if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined')
{
    web3 = new Web3(window.ethereum);
}
else
{
    web3 = new Web3(provider);
}

module.exports =  web3;

