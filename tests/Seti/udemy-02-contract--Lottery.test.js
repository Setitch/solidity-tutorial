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
  
  /**
   * IMPORTANT: These tests can be added AFTER we receive information about accounts in Ganache.
   */
  const addDynamicTests = () => {
    let numOfAccounts = 0;
    const balances = [];
    const usedAccounts = [];
    let sumOfWei = 0;
    
    forEach([
      [accounts[1], 0.011], [accounts[2], 0.2], [accounts[3], 0.2],
    ]).it(`Should entry into lottery by account %s`, async (acc, val) => {
      await deployed.methods.enroll().send({
        from: acc,
        value: web3.utils.toWei(val.toString(), 'ether'),
      });
      const players = await deployed.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(acc);
      
      balances.push(balance);
      usedAccounts.push(acc);
      sumOfWei += val;
      ++numOfAccounts;
      
      expect(players).toContain(acc);
      
    });
    
    it('Should have accounts in contract', async () => {
      const players = await deployed.methods.getPlayers().call();
      expect(players.length).toEqual(numOfAccounts);
    });
    
    it('Should properly call pickWinner', async () => {
      await deployed.methods.pickWinner().send({
        from: accounts[0],
      });
      
      let gte = 0;
      let lte = 0;
      let ggte = 0;
      
      const etherPrice = web3.utils.toBN(web3.utils.toWei(sumOfWei.toString(), 'ether'));
      const aBitSmallerThanPrice = etherPrice.sub(web3.utils.toBN(web3.utils.toWei('0.001', 'ether')));
      for (let i = 0; i < usedAccounts.length; ++i) {
        balances[i] = Math.abs(balances[i] - (await web3.eth.getBalance(usedAccounts[i])));
        gte += etherPrice.ltn(web3.utils.toBN(balances[i])) ? 1 : 0;
        lte += aBitSmallerThanPrice.lte(web3.utils.toBN(balances[i])) ? 1 : 0;
        ggte += aBitSmallerThanPrice.gte(web3.utils.toBN(balances[i])) ? 1 : 0;
      }
      expect(gte).toEqual(0); // not any balance should be bigger than the amount donated
      expect(lte).toEqual(1 ); // one account should have different value because of winning
      expect(ggte).toEqual(numOfAccounts -1 ); // all apart one account should not be modified but the winning
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
  
  it('Should fail when non manager tries to call pickWinner', async () => {
    expect.assertions(1);
  
    await expect(deployed.methods.pickWinner().send({
      from: accounts[1],
    })).rejects.toThrow();
  });
  
  it('Should fail when there is no players', async() => {
    expect.assertions(1);
  
    await expect(deployed.methods.pickWinner().send({
      from: accounts[0],
    })).rejects.toThrow();
  });
  
  it('Should return empty players as there is no players added yet', async () => {
    const players = await deployed.methods.getPlayers().call();
    expect(players.length).toEqual(0);
  });
  
  it('Should fail when enrolling without minimum amount of money', async () => {
    expect.assertions(1);
    
    await expect(deployed.methods.enroll().call()).rejects.toThrow(new Error('VM Exception while processing transaction: revert Minimum amount required for entering is 0.01 ether'));
  });
 
});
