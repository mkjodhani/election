const ElectionFactory = require('./build/ElectionFactory.json')
const web3 = require('./web3')
const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    const addr =  await new web3.eth.Contract(JSON.parse(ElectionFactory.interface))
    .deploy({data:ElectionFactory.bytecode})
    .send({from:accounts[0],gas:'1000000'});
    console.log(addr.options.address);
};
deploy();
// 0xCed71BF565Ab6f2dB8592293C35FbFFF9D034C44