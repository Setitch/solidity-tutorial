import { MetaMaskInpageProvider }                from '@metamask/providers';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { useEffect }                      from 'react';
import { injectedConnector }                     from './injected-connector';
import logo                                      from './logo.svg';
import './App.css';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

function App() {
  const {account, activate, connector, deactivate, library, active, chainId, error, setError } = useWeb3React();

  async function connect() {
    await activate(injectedConnector);
  
  }
  async function disconnect() {
    await deactivate();
  }
  
  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      window.ethereum.request({method: 'wallet_switchEthereumChain', params: [{chainId: `0x${(1337).toString(16)}`}]});
      setError(new Error('Sorry only internal ganache network is supported!'));
    }
  }, [error])
  
  return (
    <div className="App">
      <header className="App-header">
        <p>{account}</p>
        <p>{active ? 'active' : 'Non-Active'}</p>
        <p>{chainId}</p>
        <p>{`${error?.name} | ${error?.message}`}</p>
        <img src={logo} className="App-logo" alt="logo" />
        { !active && <p onClick={ connect }>Connect to MetaMask</p> }
        { active && <p onClick={ disconnect }>Disconnect from MetaMask</p> }
        <p
          onClick={() => setError(new Error('aaaaaaaaaaaaaaaaa'))}
        >Set error</p>
      </header>
    </div>
  );
}

export default App;
