const path = require('path');
const fs = require('fs');
const { compileSolFile } = require('../tests/utils');

if (!process.env.npm_config_dir) {
  console.log('To run deployment script you need to use command: "npm --dir=[dir] --file=[file] run deploy". So the file from:  "./solidity/[dir]/contracts/[file]" will be deployed!');
  process.exit(1);
}

if (!process.env.npm_config_file) {
  console.log('To run deployment script you need to use command: "npm --dir=[dir] --file=[file] run deploy". So the file from:  "./solidity/[dir]/contracts/[file]" will be deployed!');
  process.exit(1);
}

const filePath = path.join(__dirname, process.env.npm_config_dir, 'deploy.js');
if (fs.existsSync(filePath)) {
  const deployWorker = require(filePath);
  deployWorker.workWith(compileSolFile([process.env.npm_config_dir, 'contracts'], process.env.npm_config_file));
} else {
  console.log(`Deployment file is not existing at .${path.join('/src', process.env.npm_config_dir, 'deploy.js')}`);
  process.exit(2);
}
