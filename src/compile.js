const path = require('path');
const fs = require('fs');

if (!process.env.npm_config_dir) {
  console.log('To run compilation script you need to use command: "npm --dir=[dir] run compile". The file that would be executed then is:  "./src/[dir]/compile.js"');
  process.exit(1);
}

function solidityFindImports(path) {
  const file = path.join(__dirname, '../../solidity/', process.env.npm_config_dir, path);
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file);
    return {
      contents: content.toString(),
    };
  } else return { error: 'File not found' };
}
process.solidityFindImports = solidityFindImports;


const filePath = path.join(__dirname, process.env.npm_config_dir, 'compile.js');
if (fs.existsSync(filePath)) {
  require(filePath);
  process.exit(0);
} else {
  console.log(`Compilation file is not existing at .${path.join('/src', process.env.npm_config_dir, 'compile.js')}`);
  process.exit(2);
}
