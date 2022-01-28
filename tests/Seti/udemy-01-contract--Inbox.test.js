const expect = require('expect');
const ganache = require('ganache');
const Web3 = require('web3');
const { getAccounts, compileSolFile } = require('../utils');


const web3 = new Web3(ganache.provider());

const constInitialMessage = 'Initial Message';

describe(`${__filename}`, async () => {
  const compiledFile = await compileSolFile(['Seti','contracts'], 'udemy-01-contract--Inbox.sol');
    /**
   * @type {string[]}
   */
  let accounts = [];
  let firstAccountSendingOptions;
  let deployed;
  
  before(async () => {
    // get accounts
    accounts = await getAccounts(web3);
    firstAccountSendingOptions = {from: accounts[0], gas: 1000000};
  
    const contract = new web3.eth.Contract(compiledFile.getContract('Inbox').abi);
    deployed = await contract.deploy({data: compiledFile.getBytecode('Inbox'), arguments: [constInitialMessage]}).send(firstAccountSendingOptions);
  });
  
  beforeEach(async () => {

  });

  it('Test accounts available', () => {
    expect(accounts.length).toBeGreaterThan(0);
  });

  it(`Should have contract deployed`, async () => {
    expect(deployed.options.address).toBeDefined();
  });
  
  it('Should have initial message', async () => {
    expect(await deployed.methods.getMessage().call()).toEqual(constInitialMessage);
  });
  
  it('Should modify message', async () => {
    const set = await deployed.methods.setMessage('new message').send(firstAccountSendingOptions);
    
    expect(await deployed.methods.getMessage().call()).toEqual('new message');
  });
});
