const expect = require('expect');
const ganache = require('ganache');
const Web3 = require('web3');
const { getAccounts, compileSolFile } = require('../utils');
const forEach = require('mocha-each');

const web3 = new Web3(ganache.provider());
const contractName = 'Lottery';

describe(`${__filename}`, async () => {
  const compiledFile = await compileSolFile(['Seti','contracts'], 'udemy-02-contract--Lottery.sol');
    /**
   * @type {string[]}
   */
  let accounts = [];
  let firstAccountSendingOptions;
  let deployed;
  
  const addDynamicTests = () => {
    let numOfAccounts = 0;
    forEach([
      [accounts[1], 0.011], [accounts[2], 0.2], [accounts[3], 0.2],
    ]).it(`Should entry into lottery by account %s`, async (acc, val) => {
      await deployed.methods.enroll().send({
        from: acc,
        value: web3.utils.toWei(val.toString(), 'ether'),
      });
      const players = await deployed.methods.getPlayers().call();
      expect(players).toContain(acc);
      ++numOfAccounts;
    });
    
    it('Should have accounts in contract', async () => {
      const players = await deployed.methods.getPlayers().call();
      expect(players.length).toEqual(numOfAccounts);
    });
  };
  
  
  before(async () => {
    // get accounts
    accounts = await getAccounts(web3);
    firstAccountSendingOptions = {from: accounts[0], gas: 1000000};
  
    const contract = new web3.eth.Contract(compiledFile.getContract(contractName).abi);
    deployed = await contract.deploy({data: compiledFile.getBytecode(contractName)}).send(firstAccountSendingOptions);
    
    addDynamicTests();
  });
  
  beforeEach(async () => {
  });

  it('Test accounts available', () => {
    expect(accounts.length).toBeGreaterThan(0);
  });

  it(`Should have contract deployed`, async () => {
    expect(deployed.options.address).toBeDefined();
  });
  
  it('Should have creator set', async () => {
    expect(await deployed.methods.manager().call()).toEqual(accounts[0]);
  });

  it('Should fail when enrolling without minimum amount of money', async () => {
    expect.assertions(1);
    await expect(deployed.methods.enroll().call()).rejects.toThrow(new Error('VM Exception while processing transaction: revert Minimum amount required for entering is 0.01 ether'));
  });
  
  
 
});
