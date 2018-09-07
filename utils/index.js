
const snl = require('simple-node-logger');

const log = file => {
  let logger = snl.createSimpleFileLogger(file)
  logger.setLevel('info');
  return logger;
}

module.exports = {
  log
}
