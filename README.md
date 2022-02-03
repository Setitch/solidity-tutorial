# solidity-tutorial
Tutorial for learning Solidity

# start environment
To start environment simply start script `start-everything.ps1`  (if you do not have PowerShell it's simple to install on any system)

# run tests
`npm run test -- --watch`

## Utils for tests
The utils are in `./tests/utils.js` - and are commented with jsdoc allowing some editor intelisence
There is also `mocha-each` installed that allows usage of `forEach` function similar to `.each` function from `jest` testing library.


# Deprecated
You can still use it, but these are no longer needed. Tests are using `utils.js` library and manual run is no longer required.
## run
`npm -dir [name] run start` will start *index.js* in _src/[name]/_ directory

## deploy
`npm -dir [name] run deploy` will start *deploy.js* in _src/[name]/_ directory
