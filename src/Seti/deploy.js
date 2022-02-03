const HDWallet = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { getAccounts } = require('../../tests/utils');
require('dotenv').config();

const walletOptions = {
  mnemonic: { phrase: process.env.WALLET_MNEMONIC },
  providerOrUrl: process.env.WALLET_INFURA_URL,
};

/**
 *
 * @returns {Promise<void>}
 * @param {Promise<SolCompiled>} compiled
 */
const workWith = async (inPromise) => {
  const compiled = await inPromise;
  console.log('deploy', typeof compiled, compiled);
  const provider = new HDWallet(walletOptions);
  const web3 = new Web3(provider);
  const accounts = await getAccounts(web3);
  console.log('Attempting to deploy from account', accounts[0]);
  const address = await new web3.eth.Contract(compiled.getContract('Inbox').abi).deploy({data: compiled.getBytecode('Inbox'), arguments: ['Hi there!']}).send({gas: '1000000', from: accounts[0]});
  console.log('   Deployed at: ', address.options.address);
  provider.engine.stop();
};


module.exports = {
  workWith: workWith,
};
