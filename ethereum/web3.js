// const Web3 = require('web3')
// let web3;
// if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined')
// {
//     web3 = new Web3(window.ethereum);
// }
// else
// {
//     const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/281808df56034ff6bcba3da70667f4cd");
//     web3 = new Web3(provider);
// }
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
module.exports =  web3;

