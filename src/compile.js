const path = require('path');
const fs = require('fs');
require('dotenv').config();


if (!process.env.npm_config_dir) {
  console.log('To run compilation script you need to use command: "npm --dir=[dir] run compile". The file that would be executed then is:  "./src/[dir]/compile.js"');
  process.exit(1);
}


const filePath = path.join(__dirname, process.env.npm_config_dir, 'compile.js');
if (fs.existsSync(filePath)) {
  module.exports = require(filePath);
} else {
  console.log(`Compilation file is not existing at .${path.join('/src', process.env.npm_config_dir, 'compile.js')}`);
  process.exit(2);
}
