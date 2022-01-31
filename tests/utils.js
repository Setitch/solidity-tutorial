const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');


class SolCompiled {
  #fileName;
  contracts = {};
  constructor(fileName) {
    this.#fileName = fileName;
  }
  
  /**
   *
   * @param {string} name
   * @returns {{
   *   abi: {
   *      inputs: {internalType: string | 'string'; name: string; type: string | 'string';}[];
   *      stateMutability: string | 'view' | 'nonpayable';
   *      type: string | 'function' | constructor
   *   }[];
   *   devdoc: object;
   *   evm: {assembly: string; bytecode: {functionDebugData: object; generatedSources: *[]; linkReferences: object; object: string; opcodes: string; sourceMap: string;}, deployedBytecode: {functionDebugData: object; generatedSources: *[]; linkReferences: object; object: string; opcodes: string; sourceMap: string;}; gasEstimates: {creation: {codeDepositCods: number | string; executionCost: string | number; totalCost: string | number;}, external: Records<string, number | string>>}; legacyAssembly: {".code": *[]; data: Record<number, object>; methodIdentifiers: Record<string, string>;};
   *   ewasm: {wasm: string;};
   *   metadata: string;
   *   storageLayout: {storage: *[], types: object;};
   *   userdoc: {kind: string; methods: object; version: number};
   * }}
   */
  getContract(name) {
    return this.contracts[this.#fileName][name];
  }
  
  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getBytecode(name) {
    return this.contracts[this.#fileName][name].evm.bytecode.object;
  }
}

/**
 *
 * @param {Web3} web3
 * @returns {Promise<string[]>}
 */
const getAccounts = async (web3) => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, addresses) => {
      if (err) {
        return reject(err);
      }
      
      return resolve(addresses);
    });
  });
};

/**
 *
 * @param {string | string[]} directoryNames
 * @returns {(function(*=): ({contents: string}))|*}
 */
const solidityFindImports = (directoryNames) => {
  /**
   * @param {string} fileName
   * @returns {{contents: string;}}
   * @returns {{error: string;}}
   */
  return (fileName) => {
    const file = path.join(__dirname, '../solidity/', directoryNames instanceof Array ? directoryNames.join('/') : directoryNames, fileName);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file);
      return {
        contents: content.toString(),
      };
    } else return { error: 'File not found' };
  };
}

/**
 *
 * @param {string | string[]} directoryNames
 * @param {string} fileName
 * @returns {Promise<SolCompiled>}
 */
const compileSolFile = async (directoryNames, fileName) => {
  const fileSourcePath = path.join(__dirname, '../solidity/', directoryNames instanceof Array ? directoryNames.join('/') : directoryNames, fileName);;
  const source = fs.readFileSync(fileSourcePath);
  const input = {
    language: 'Solidity',
    sources: {
      [fileName]: {
        content: source.toString(),
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
  
  return Object.assign(new SolCompiled(fileName), JSON.parse(solc.compile(JSON.stringify(input, { import: solidityFindImports(directoryNames) }))));
};


module.exports = {
  getAccounts,
  solidityFindImports,
  compileSolFile,
};
