const path = require('path');
const fs = require('fs');
const solc = require('solc')

// const file_udemy1__Inbox = 'udemy-01-contract--Inbox.sol';
// const path_udemy1__Inbox = path.join(__dirname, '..', '..', 'solidity/Seti/contracts', file_udemy1__Inbox);
// const source_udemy1__Inbox = fs.readFileSync(path_udemy1__Inbox);
//
const file_udemy1__Inbox = '1-test-contract--HelloWorld.sol';
const path_udemy1__Inbox = path.join(__dirname, '..', '..', 'solidity/Seti/contracts', file_udemy1__Inbox);
const source_udemy1__Inbox = fs.readFileSync(path_udemy1__Inbox);

let input = {};

input = {
  language: 'Solidity',
  sources: {
    [file_udemy1__Inbox]: {
      content: source_udemy1__Inbox.toString(),
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};


module.exports = {
  file: file_udemy1__Inbox,
  compiled: solc.compile(JSON.stringify(input, { import: process.solidityFindImports })),
};

