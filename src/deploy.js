const path = require('path');
const fs = require('fs');

if (!process.env.npm_config_dir) {
  console.log('To run deployment script you need to use command: "npm --dir=[dir] run deploy". The file that would be executed then is:  "./src/[dir]/deploy.js"');
  process.exit(1);
}

const filePath = path.join(__dirname, process.env.npm_config_dir, 'deploy.js');
if (fs.existsSync(filePath)) {
  require(filePath);
} else {
  console.log(`Deployment file is not existing at .${path.join('/src', process.env.npm_config_dir, 'deploy.js')}`);
  process.exit(2);
}
