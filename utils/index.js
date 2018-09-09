const fs = require("fs");
const snl = require('simple-node-logger');
const mysql = require("mysql2/promise");

const log = file => {
  //delete file 
  fs.unlinkSync(file);
  let logger = snl.createSimpleFileLogger(file)
  //let logger = snl.createSimpleLogger()
  logger.setLevel('debug');
  return logger;
}

async function connect(options) {
  let pool = null;
  try {
    pool = await mysql.createPool(options);
  } catch (e) {
    console.log(e);
  }
  return pool;
}

async function unconnect(pool) {
  try {
    await pool.end();
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

module.exports = {
  log,
  connect,
  unconnect
}
