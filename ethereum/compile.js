const fs = require('fs');
const path = require('path');
const solc = require('solc');
const fs_extra = require('fs-extra')
var input = {
    language: 'Solidity',
    sources: {
    },
    settings: {
        outputSelection: {
        '*': {
            '*': ['*']
        }
        }
    }
};
  
var contract_path = path.resolve(__dirname ,"contracts","Election.sol");
var source = fs.readFileSync(contract_path,'utf-8')
var output = solc.compile(source,1);
for(var i in output.errors)
{
    console.log(output.errors[i]);
}
if(!output.errors)
{
    // `output` here contains the JSON output as specified in the documentation
    for(var contract in output.contracts)
    {
        var json_path = path.resolve(__dirname ,"build",contract.replace(":","")+".json");
        fs_extra.outputFileSync(json_path,JSON.stringify(output.contracts[contract]))
    }
}

// input.sources["Election.sol"] = {
//     content:source
// }
// var output = JSON.parse(solc.compile(JSON.stringify(input)));

// for(var i in output.errors)
// {
//     console.log(output.errors[i].formattedMessage);
// }
// if(!output.errors)
// {
//     // `output` here contains the JSON output as specified in the documentation
//     for(var contract in output.contracts['Election.sol'])
//     {
//         var json_path = path.resolve(__dirname ,contract+".json");
//         fs_extra.outputFileSync(json_path,JSON.stringify(output.contracts['Election.sol'][contract]))
//     }
// }

