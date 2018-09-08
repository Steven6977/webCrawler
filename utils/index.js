const fs = require("fs");
const snl = require('simple-node-logger');

const log = file => {
  //delete file 
  fs.unlinkSync(file);
  let logger = snl.createSimpleFileLogger(file)
  logger.setLevel('debug');
  return logger;
}

module.exports = {
  log
}
