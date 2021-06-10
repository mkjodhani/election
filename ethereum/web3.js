const Web3 = require('web3')
const ganache = require('ganache-cli')
let web3;
// if(typeof window !== 'undefined' || typeof window.ethereum !== 'undefined')
// {
//     web3 = new Web3(window.ethereum);
// }
// else
// {
//     const provider = new Web3.providers.HttpProvider('https://localhost:7545');
//     web3 = new Web3(provider);
// }
// const provider = new Web3.providers.HttpProvider('https://localhost:7545');
web3 = new Web3(ganache.provider());
module.exports =  web3;